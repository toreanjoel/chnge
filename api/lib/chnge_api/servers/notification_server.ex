defmodule ChngeApi.Servers.NotificationServer do
  use GenServer
  require Logger

  @get_user_by_id "get_user_by_id"
  @set_insight "set_insight"

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

    # process the insight
    process_insight(new_state)

    # check if we should stop the process
    check_and_stop(new_state)
    {:noreply, new_state}
  end

  # Schedule and process the notifications
  defp push_notification(%{id: user_id} = data, type) do
    # Fetch user data by id
    {status, result} = ChngeApi.Core.Python.execute_file_with_params(@get_user_by_id, [user_id])

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
                    "Check out yesterday's insights. Tap here to view and prepare yourself! 📈",
                  data: %{
                    # The view we want to render
                    view: "view-daily-goal"
                  }
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
                    "Your daily insights are here! Take a moment to review your day. Tap to see what went well and what can be better tomorrow. 💤",
                  data: %{
                    # The view we want to render
                    view: "view-insight"
                  }
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
    {status, result} = ChngeApi.Core.Python.execute_file_with_params(@get_user_by_id, [state.id])

    Logger.info("fn schedule_messages: Fetch user data. User status: #{status}")

    case status do
      :ok ->
        Logger.info("fn schedule_messages: Success Fetch User Data. Schedule Notifications")
        data = Jason.decode!(result)
        timezone = Kernel.get_in(data, ["profile", "timezone"])
        history = Kernel.get_in(data, ["transactions", "history"])
        current_date = Kernel.get_in(data, ["transactions", "current"])
        current_days_data = Map.get(history, current_date, %{})
        curr_time = DateTime.utc_now() |> DateTime.to_unix()

        Logger.info("fn schedule_messages: Timezone: #{timezone}")

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

  # process the history data
  defp process_insight(state) do
    # Create the script to update the overview - use prev days context
    # Send Notification to have the user view (extra data for client to open view)
    {status, result} = ChngeApi.Core.Python.execute_file_with_params(@get_user_by_id, [state.id])

    case status do
      :ok ->
        data = Jason.decode!(result)
        history = Kernel.get_in(data, ["transactions", "history"])
        current_date = Kernel.get_in(data, ["transactions", "current"])
        current_days_data = Map.get(history, current_date, %{})
        history_data = if is_nil(history), do: %{}, else: history

        # We check if there is data and then process to send notifications, do noting otherwise
        if !Enum.empty?(current_days_data) do
          insight_list = create_insight_list(history_data, current_date)

          {ai_status, resp} =
            ChngeApi.Core.Gpt.insight(
              Jason.encode!(current_days_data),
              Jason.encode!(insight_list)
            )

          case ai_status do
            :ok ->
              timezone = Kernel.get_in(data, ["profile", "timezone"])
              curr_time = DateTime.utc_now() |> DateTime.to_unix()
              {_, new_date} = Date.from_iso8601(current_date)

              ChngeApi.Core.Python.execute_file_with_params(@set_insight, [
                state.id,
                current_date,
                Date.to_string(Date.add(new_date, 1)),
                resp
              ])

              # TODO: generate the todo for the morning or day to schedule based on insight

              # sending push after we generated from AI
              push_notification(state, :midnight)

              # schedule the 7am based on the generated overview that was successfully made
              next_seven_am =
                ChngeApi.Core.TimeScheduler.next_seven_am_unix(
                  curr_time,
                  timezone
                )

              Logger.info("Scheduled next 7am, adding: #{next_seven_am - curr_time} seconds")
              Process.send_after(self(), :seven_am, (next_seven_am - curr_time) * 1000)

              {:ok, "Successfully got overview data updated"}

            _ ->
              {:error, resp}
          end
        else
          Logger.info("There was no data to process for the day")
          {:ok, "No data to process for the day"}
        end

      _ ->
        Logger.info("There was an issue getting the details for user: #{state.id}")
        {:error, "No data found for user"}
    end
  end

  # create a list of insight data that will be used as context data
  defp create_insight_list(response_data, current_date) do
    # Parse the current date
    {:ok, current_date} = Date.from_iso8601(current_date)

    # Filter and map the response data
    Enum.reduce(response_data, [], fn {date_string, data}, acc ->
      # Parse the date string
      {:ok, date} = Date.from_iso8601(date_string)

      # Check if the date is within the last 7 days but not the current date
      # TODO: 7 days can be changed when we add payments
      if Date.diff(current_date, date) <= 7 and Date.diff(current_date, date) > 0 do
        # Extract the insight
        insight = Map.get(data, "insight", "")

        # Append to the accumulator if insight is present
        if insight != "" do
          [%{date: date_string, insight: insight} | acc]
        else
          acc
        end
      else
        acc
      end
    end)
    # Reverse to maintain chronological order
    |> Enum.reverse()
  end
end
