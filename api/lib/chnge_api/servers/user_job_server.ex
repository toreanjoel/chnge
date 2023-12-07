defmodule ChngeApi.Servers.UserJobServer do
  @doc """
    This is started and makes a request to get all the users and startup a process per user.
    Each user will have a job that will take meta data and run to schedule overview and notifications.

    Check every 15min if all users have a process and start if there is not one already. Supervised.
  """
  use GenServer
  require Logger

  # Override the `start_link` function as before
  def start_link(args) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  # Initialize the state of the server
  def init(state) do
    # link spawn the processes of teh notification server

    # Schedule a message to be sent every 15 minutes (900000 milliseconds)
    :timer.send_interval(900_000, :init_user_processes)

    # first instance to attempt
    spawn_link(fn  -> user_process_init()  end)
    {:ok, state}
  end

  def handle_info(:init_user_processes, state) do
    # This function is called every 15 minutes
    # Place your recurring task logic here
    spawn_link(fn  -> user_process_init()  end)

    {:noreply, state}
  end

  # make a request here to get the user data and start a process per user
  defp user_process_init() do
    # Retrieve user data, for example, a list of user IDs
    {status, result} = ChngeApi.Core.Python.execute_file("firebase_user_data")
    case status do
      :ok ->
        # here we process the data for having
        data = Jason.decode!(result)
        users = data |> Map.keys()

        Enum.each(users, fn user_id ->
          spawn(fn -> start_user_notification_server(user_id) end)
        end)
      _ -> Logger.log("There was no data")
    end
  end

  defp start_user_notification_server(id) do
    case GenServer.whereis(String.to_atom("user_notification_process:#{id}")) do
      nil ->
        # we need to get the auth token to send from the server
        {_, token} = ChngeApi.Core.Python.execute_file("firebase_gen_auth_token")

        process_payload = %{
          id: id,
          server_token: token
        }
        # If the process does not exist, start it
        ChngeApi.Servers.UserNotificationServer.start_link(process_payload)
      _pid ->
        # If the process already exists, do nothing
        :ok
    end
  end
end
