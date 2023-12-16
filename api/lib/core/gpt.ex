defmodule ChngeApi.Core.Gpt.Prompt do
  @moduledoc """
    This is specific to the prompt alone, we will create the prompt data here
  """

  @doc """
    The prompt around getting insight for the current day generated and optional context added
  """
  def insight(input, prev_insights \\ []) do
    "Conduct a detailed analysis of the latest transactions, focusing on the types of purchases and the associated moods.
    Utilize the entire history of previous insights to uncover deeper patterns and trends in spending behavior.
    Avoid monetary values, use simple mood descriptors like 'good' or 'bad', and refer to transactions by their titles, not IDs.
    Important: Don't mention the system values assigned to mood or IDs, use the words good or bad (good: 1 and bad: 0) and make sure to alaways add spaces between headings and content

    Latest Transactions (INPUT):
    #{input}

    Previous Insights (PREV_INSIGHTS):
    #{prev_insights}

    Format the response as follows:

    🔄 Today's Transactions and Mood Analysis

    Summarize today's purchases, emphasizing the general mood. Highlight any changes or consistencies in your spending behavior compared to past trends.

    🔍 Long-Term Trends and Habit Analysis

    Analyze your long-term spending behaviors, focusing on persistent or new habits. Pay attention to how mood patterns correlate with different types of purchases over time.

    💡 Tailored Actionable Insights

    Provide personalized suggestions based on identified spending habits and mood correlations. Include:

    1️⃣ [First Insight]: ...
    2️⃣ [Second Insight]: ...
    3️⃣ [Third Insight]: ...

    These insights should be specific to recent spending trends and habits.
    Note: If adding the points of insights, make some spacing if they are points or bullet points so its easy to read.

    📌 Relevance of Today's Data

    If today's data doesn't offer relevant insights into your spending behavior and mood, this will be noted. The focus will then shift to significant patterns from your past data.

    🏆 Specific Encouragement and Support

    Recognize specific achievements in managing your spending behavior. Offer encouragement for continued progress, citing examples of positive changes you've made.

    🔎 Noteworthy Behavioral Observations

    Highlight any significant behavioral trends or observations from your entire data history, emphasizing how these insights could impact your future financial decisions.

    The analysis aims to be insightful, concise, and focused on your behavior and feelings related to transactions. Emojis are used for section titles to enhance clarity and engage you more effectively."
  end

  @doc """
    A suggestion that is generated for the prev days insight
  """
  def daily_goal(prev_insights) do
    "Based on the provided insights from the previous day, create a concise, engaging plan for today. This plan should be goal-oriented and include emojis for a playful and motivational tone.

    Previous Day's Insights (PREV_DAY_INSIGHTS):
    #{prev_insights}

    Structure the response as follows:

    🌅 Good Morning!

    Start with a brief overview of the key insights from yesterday.
    🎯 Today's Financial Goals

    List 2-3 specific, achievable financial goals for the day, inspired by yesterday's insights. Use a playful tone and emojis to make the goals engaging. For example:
    1️⃣ [Goal 1]: ...
    2️⃣ [Goal 2]: ...
    🚀 Quick Tips for Success

    Offer a couple of fun, memorable tips or reminders that will help stay focused on these financial goals throughout the day.
    💪 A Boost of Encouragement

    Conclude with an uplifting message to motivate and inspire confidence in achieving today's financial goals.
    The aim is to provide a clear, positive financial direction for the day, keeping the message light-hearted yet focused to help start the day with an optimistic financial mindset."
  end
end

defmodule ChngeApi.Core.Gpt do
  @moduledoc """
    Module for helper methods accessing Open AI interaction
  """
  require Logger

  @timeout 120_000

  @doc """
    The prompt sent to get the message
    NOTE: This module will have set the params to a manageable temp and potentially limit input
    See body
  """
  def insight(input, context) do
    prompt = ChngeApi.Core.Gpt.Prompt.insight(input, context)
    # check the status - this is help make sure we dont execute test payloads
    Logger.info("Started AI workflow generation")
    # TODO: conditional for paying users?
    if !is_nil(System.get_env("OPEN_AI_TOKEN")) do
      body_payload =
        Map.put(
          %{
            "max_tokens" => 1000,
            "temperature" => 1,
            "model" => System.get_env("OPEN_AI_MODEL")
          },
          "messages",
          [
            %{
              "role" => "system",
              "content" => prompt
            }
          ]
        )

      {status, resp} =
        HTTPoison.post(
          "https://api.openai.com/v1/chat/completions",
          Jason.encode!(body_payload),
          [
            {"Content-type", "application/json"},
            {"Authorization", "Bearer #{System.get_env("OPEN_AI_TOKEN")}"}
          ],
          recv_timeout: 120_000
        )

      case status do
        :ok -> handle_response(resp)
        :error -> {:error, "There was an error: #{resp}"}
      end
    else
      {:error, "There was an error getting the OPEN_AI_TOKEN key, check env variables"}
    end
  end

  @doc """
    The prompt sent to get the message
    NOTE: This module will have set the params to a manageable temp and potentially limit input
    See body
  """
  def daily_goal(input) do
    prompt = ChngeApi.Core.Gpt.Prompt.daily_goal(input)
    # check the status - this is help make sure we dont execute test payloads
    Logger.info("Started AI workflow generation")
    # TODO: conditional for paying users?
    if !is_nil(System.get_env("OPEN_AI_TOKEN")) do
      body_payload =
        Map.put(
          %{
            "max_tokens" => 1000,
            "temperature" => 1,
            "model" => System.get_env("OPEN_AI_MODEL")
          },
          "messages",
          [
            %{
              "role" => "system",
              "content" => prompt
            }
          ]
        )

      {status, resp} =
        HTTPoison.post(
          "https://api.openai.com/v1/chat/completions",
          Jason.encode!(body_payload),
          [
            {"Content-type", "application/json"},
            {"Authorization", "Bearer #{System.get_env("OPEN_AI_TOKEN")}"}
          ],
          recv_timeout: 120_000
        )

      case status do
        :ok -> handle_response(resp)
        :error -> {:error, "There was an error: #{resp}"}
      end
    else
      {:error, "There was an error getting the OPEN_AI_TOKEN key, check env variables"}
    end
  end

  # Handle the success reponse and its codes that came back from the HTTP post
  defp handle_response(resp) do
    case resp.status_code do
      400 ->
        {
          :error,
          "There was an error: #{Jason.decode!(resp.body)}"
        }

      200 ->
        resp = Jason.decode!(resp.body)
        {_status, data} = return_choice_by_index(resp, 0)
        {:ok, data}

      _ ->
        Logger.error("Error prompt",
          file: "gpt.ex",
          stacktrace: "fn -> handle_response | innput resp from fn -> prompt"
        )
    end
  end

  # Take in a list of choiced from a response and return the index
  defp return_choice_by_index(choices, index) do
    {_tag, data} = Enum.at(choices, index)
    {:ok, Enum.at(data, 0) |> Map.get("message") |> Map.get("content")}
  end
end
