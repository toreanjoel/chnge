defmodule ChngeApi.Servers.UserNotificationServer do
  @moduledoc """
    Starts with user metadata, instance that schedules push notifications nad creates overviews per day.
    Check the timezone and see if its the end of the day to set overview or insight.

    The system checks if its morning relative to the user and send a sumarize notification.
  """
  use GenServer

  @doc """
    State the server with base argument data
  """
  def start_link(id) do
    # we dont give a constant name so we can run multiple instances of this
    GenServer.start_link(__MODULE__, %{ id: id}, name: String.to_atom("user_notification_process:" <> id))
  end

  @doc """
    Initialize the state of the server
  """
  def init(state) do
    # use metadata to start user notification scheduler
    process_notification(state)
    {:ok, state}
  end

  # schedule and process the notifications
  defp process_notification(data) do
    # Fetch user data by id

    # Generate access token to make push

    # parse user data and create insight

    # send push notification
    # TODO: make a request to get user specific data on iterateion
    IO.inspect(data)
  end
end
