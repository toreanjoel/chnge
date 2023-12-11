defmodule ChngeApi.Servers.UserServer do
  @doc """
    This is started and makes a request to get all the users and startup a process per user.
    Each user will have a job that will take meta data and run to schedule overview and notifications.

    Check every 15min if all users have a process and start if there is not one already. Supervised.
  """
  use GenServer
  require Logger

  # function scripts
  @firebase_user_details "firebase_user_data"

  # Override the `start_link` function as before
  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  # Initialize the state of the server
  def init(state) do
    Logger.info("fn init: Init user server")
    # link spawn the processes of teh notification server

    # Schedule a message to be sent every 15 minutes (900000 milliseconds)
    :timer.send_interval(900_000, :init_user_processes)

    # first instance to attempt
    spawn_link(fn  -> user_process_init()  end)
    {:ok, state}
  end

  def handle_info(:init_user_processes, state) do
    Logger.info("fn handle_info: Check user processes")
    # This function is called every 15 minutes
    # Place your recurring task logic here
    spawn_link(fn  -> user_process_init()  end)

    {:noreply, state}
  end

  # make a request here to get the user data and start a process per user
  defp user_process_init() do
    # Retrieve user data, for example, a list of user IDs
    {status, result} = ChngeApi.Core.Python.execute_file(@firebase_user_details)
    case status do
      :ok ->
        # here we process the data for having
        data = Jason.decode!(result)
        users = data |> Map.keys()

        Enum.each(users, fn user_id ->
          user_data = Map.get(data, user_id)
          last_online = if !is_nil(user_data), do: Kernel.get_in(user_data, ["metadata", "lastOnline"])
          Logger.info("fn user_process_init: Create user process data")
          spawn(fn -> start_user_notification_server(user_id, last_online) end)
        end)
      _ -> Logger.info("There was no data")
    end
  end

  # we check if the process for a user exists
  defp start_user_notification_server(id, last_online) do
    if (!is_diff_more_than_5_days(last_online)) do
      case GenServer.whereis(String.to_atom("notification_process:#{id}")) do
        nil ->
          Logger.info("fn start_user_notification_server: start user process. User: #{id}")
          # start non exisiting user processes - new users added, other ignored or restarted
          ChngeApi.Servers.NotificationServer.start_link(%{ id: id})
        _pid ->
          # If the process already exists, do nothing
          :ok
      end
    else
      :inactive
    end
  end

  # the timestamp is more than 5 days of inactivity
  defp is_diff_more_than_5_days(last_online) do
    current_time = DateTime.utc_now() |> DateTime.to_unix(:millisecond)
    # Calculate the absolute difference in milliseconds
    diff = current_time - last_online
    # Convert milliseconds to days
    diff_in_days = diff / (24 * 60 * 60 * 1000)
    # # Check if the difference is more than 5 days
    diff_in_days > 5
  end
end
