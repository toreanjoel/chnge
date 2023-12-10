defmodule ChngeApi.Servers.UserNotificationServer do
  @moduledoc """
    Starts with user metadata, instance that schedules push notifications nad creates overviews per day.
    Check the timezone and see if its the end of the day to set overview or insight.

    The system checks if its morning relative to the user and send a sumarize notification.
  """
  require Logger
  use GenServer

  # function scripts
  @firebase_user_by_id "firebase_user_data_by_id"

  @doc """
    State the server with base argument data
  """
  def start_link(payload) do
    # we dont give a constant name so we can run multiple instances of this
    GenServer.start_link(__MODULE__, payload,
      name: String.to_atom("user_notification_process:" <> payload.id)
    )
  end

  @doc """
    Initialize the state of the server
  """
  def init(state) do
    #TODO: here we check if its time to send, end of day with timezone
    :timer.send_interval(3_600_00, :schedule_overview)
    # use metadata to start user notification scheduler
    spawn_link(fn  -> process_notification(state)  end)
    {:ok, state}
  end

  def handle_info(:schedule_overview, state) do
    # This function is called every 15 minutes
    # Place your recurring task logic here
    spawn_link(fn  -> process_notification(state)  end)

    {:noreply, state}
  end

  # schedule and process the notifications
  defp process_notification(%{id: user_id} = data) do
    # Fetch user data by id
    {status, result} = ChngeApi.Core.Python.execute_file_with_params(@firebase_user_by_id, [user_id])

    case status do
      :ok ->
        # here we process the data for having
        data = Jason.decode!(result)
        # user push token
        push_token = Kernel.get_in(data, ["metadata", "pushToken"])
        # parse user data and create insight

        # here we need to get the new generated token to send notificaitons through REST
        resp = GenServer.call(ChngeApi.Servers.AccessTokenServer, :get_token)

        if !is_nil( server_token = Map.get(resp, :token)) do
          # send push notification
          #TODO: Look for sending extra data with regards to link for client to open views
          Core.Notification.send(%{ title: "Title", body: "Body Message"}, push_token, server_token)
        else
          Logger.log("The token does not exist, make sure process is up or token exists")
        end
      _ ->
        Logger.log("There was no data")
    end
  end
end
