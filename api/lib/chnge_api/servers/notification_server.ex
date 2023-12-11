defmodule ChngeApi.Servers.NotificationServer do
  use GenServer
  require Logger

  @get_user_by_id "get_user_data_by_id"

  # Starts the server with base argument data
  def start_link(payload) do
    # We don't give a constant name so we can run multiple instances of this
    GenServer.start_link(__MODULE__, payload,
      name: String.to_atom("notification_process:" <> payload.id)
    )
  end

  # Initialize the state of the server
  def init(state) do
    # Initialize flags for 6 PM and midnight notifications
    state = Map.put(state, :seven_am_sent, false)
    new_state = Map.put(state, :one_pm_sent, false)
    new_state = Map.put(new_state, :six_pm_sent, false)
    new_state = Map.put(new_state, :midnight_sent, false)

    # we dont spawn a new proess as we will need to send to the genserver to listen
    schedule_messages(new_state)

    {:ok, new_state}
  end

  def handle_info(:seven_am, state) do
    Logger.info("fn handle_info: :seven_am listener")
    new_state = Map.put(state, :seven_am_sent, true)

    # send push notification
    push_notification(state, :seven_am)

    # check if we need to stop the process
    check_and_stop(new_state)
    {:noreply, new_state}
  end

  def handle_info(:one_pm, state) do
    Logger.info("fn handle_info: :one_pm listener")
    new_state = Map.put(state, :one_pm_sent, true)

    # send push notification
    push_notification(state, :one_pm)

    # check if we need to stop the process
    check_and_stop(new_state)
    {:noreply, new_state}
  end

  def handle_info(:six_pm, state) do
    Logger.info("fn handle_info: :six_pm listener")
    new_state = Map.put(state, :six_pm_sent, true)

    # send push notification
    push_notification(state, :six_pm)

    # check if we need to stop the process
    check_and_stop(new_state)
    {:noreply, new_state}
  end

  def handle_info(:midnight, state) do
    Logger.info("fn handle_info: :midnight listener")
    new_state = Map.put(state, :midnight_sent, true)

    # send the push notification
    push_notification(state, :midnight)

    # check if we should stop the process
    check_and_stop(new_state)
    {:noreply, new_state}
  end

  # Schedule and process the notifications
  defp push_notification(%{id: user_id} = data, type) do
    # Fetch user data by id
    {status, result} =
      ChngeApi.Core.Python.execute_file_with_params(@get_user_by_id, [user_id])

    case status do
      :ok ->
        data = Jason.decode!(result)
        push_token = Kernel.get_in(data, ["metadata", "pushToken"])
        timezone = Kernel.get_in(data, ["profile", "timezone"])
        resp = GenServer.call(ChngeApi.Servers.AccessTokenServer, :get_token)

        if !is_nil(server_token = Map.get(resp, :token)) do
          # Logic for sending notification based off type
          case type do
            :seven_am ->
              Logger.info("Send push notification 7am: #{user_id}")

              ChngeApi.Core.Notification.send(
                %{
                  title: "🌞 Good Morning! Ready for a Fresh Start?",
                  body:
                    "Check out yesterday's insights and set your goals for today. Tap here to start your day on a bright note! 📈"
                },
                push_token,
                server_token
              )

            :one_pm ->
              Logger.info("Send push notification 1pm: #{user_id}")

              ChngeApi.Core.Notification.send(
                %{
                  title: "🕐 Midday Check-in! How's Your Day Going?",
                  body:
                    "Halfway through the day! Remember to log any plans or transactions. Keep your day on track! 📝"
                },
                push_token,
                server_token
              )

            :six_pm ->
              Logger.info("Send push notification 6pm: #{user_id}")

              ChngeApi.Core.Notification.send(
                %{
                  title: "🌆 Evening Reminder: Log Today's Transactions",
                  body:
                    "Let's wrap up the day! Don't forget to add today's transactions. A few taps and you're done! ✅"
                },
                push_token,
                server_token
              )

            :midnight ->
              Logger.info("Send push notification midnight: #{user_id}")

              ChngeApi.Core.Notification.send(
                %{
                  title: "🌙 Day's Overview Ready!",
                  body:
                    "Your daily insights are here! Take a moment to review your day. Tap to see what went well and what can be better tomorrow. 💤"
                },
                push_token,
                server_token
              )

            _ ->
              :noreply
          end
        else
          Logger.info("The token does not exist, make sure process is up or token exists")
        end

      _ ->
        Logger.info("There was no data")
    end
  end

  # schedule the messages to be sent in the future
  defp schedule_messages(state) do
    Logger.info("fn schedule_messages")

    # Fetch user data by id
    {status, result} =
      ChngeApi.Core.Python.execute_file_with_params(@get_user_by_id, [state.id])

    Logger.info("fn schedule_messages: Fetch user data. User status: #{status}")

    case status do
      :ok ->
        Logger.info("fn schedule_messages: Success Fetch User Data. Schedule Notifications")
        data = Jason.decode!(result)
        timezone = Kernel.get_in(data, ["profile", "timezone"])
        curr_time = DateTime.utc_now() |> DateTime.to_unix()

        Logger.info("fn schedule_messages: Timezone: #{timezone}")

        # Schedule 1 PM message
        next_seven_am =
          ChngeApi.Core.TimeScheduler.next_seven_am_unix(
            curr_time,
            timezone
          )

        Logger.info("Scheduled next 7am, adding: #{next_seven_am - curr_time} seconds")

        Process.send_after(self(), :seven_am, (next_seven_am - curr_time) * 1000)

        # Schedule 1 PM message
        next_one_pm =
          ChngeApi.Core.TimeScheduler.next_one_pm_unix(
            curr_time,
            timezone
          )

        Logger.info("Scheduled next 1pm, adding: #{next_one_pm - curr_time} seconds")

        Process.send_after(self(), :one_pm, (next_one_pm - curr_time) * 1000)

        # Schedule 6 PM message
        next_six_pm =
          ChngeApi.Core.TimeScheduler.next_six_pm_unix(
            curr_time,
            timezone
          )

        Logger.info("Scheduled next 6pm, adding: #{next_six_pm - curr_time} seconds")

        Process.send_after(self(), :six_pm, (next_six_pm - curr_time) * 1000)

        # Schedule midnight message
        next_midnight =
          ChngeApi.Core.TimeScheduler.next_midnight_unix(
            curr_time,
            timezone
          )

        Logger.info("Scheduled midnight, adding: #{next_midnight - curr_time} seconds")

        Process.send_after(self(), :midnight, (next_midnight - curr_time) * 1000)

      _ ->
        Logger.info("There was an issue scheduling the process: #{state.id}")
        :error
    end
  end

  # check that will shut the process down
  defp check_and_stop(state) do
    if state[:six_pm_sent] and state[:midnight_sent] and
         state[:seven_am_sent] and state[:one_pm_sent] do
      # Both flags are set, stop the process
      GenServer.stop(self(), :normal)
    end
  end

  defp process_overview(state) do
    # Create the script to update the overview - use prev days context
    # Send Notification to have the user view (extra data for client to open view)
    #
  end
end
