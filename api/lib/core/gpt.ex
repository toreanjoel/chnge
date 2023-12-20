defmodule ChngeApi.Core.Gpt.Prompt do
  @moduledoc """
    This is specific to the prompt alone, we will create the prompt data here
  """

  @doc """
    The prompt around getting insight for the current day generated and optional context added
  """
  def insight(input, today_goals, prev_insights \\ []) do
    "🔄 Today's Transactions and Mood Analysis

    Input Data (Latest Transactions):
    #{input}
    Summarize today's purchases, emphasizing the general mood. Based on the input data, highlight any changes or consistencies in your spending behavior compared to past trends. Examine the emotional context of these transactions and their impact on your financial goals.

    🎯 Evaluation Against Today's Goals

    Input Data (Today's Goals):
    #{today_goals}
    Assess how today's transactions align with your daily financial goals. Review if the spending choices made today reflect progress towards these goals. Consider both the nature of the expenses and the associated emotional responses in the context of your goals.

    🔍 Long-Term Trends and Habit Analysis

    Input Data (Previous Insights):
    #{prev_insights}
    Analyze your long-term spending behaviors, focusing on persistent or new habits, using previous insights. Explore how mood patterns correlate with different types of purchases over time and how these are reflected in today's transactions.

    💡 Tailored Actionable Insights

    Based on the input data (today's transactions, previous insights, and today's goals), provide personalized suggestions focusing on identified spending habits and mood correlations. Include specific insights related to:

    1️⃣ [First Insight]: Derived from today’s transactions and goal alignment.
    2️⃣ [Second Insight]: Based on the correlation between moods, spending patterns, and goal achievement.
    3️⃣ [Third Insight]: Focused on long-term habits and their alignment with financial and emotional goals.

    📌 Relevance of Today's Data

    Evaluate today's data in the context of long-term trends and daily goal achievement. Note any new insights or reinforcement of previous patterns, and their implications for future goal setting.

    🏆 Specific Encouragement and Support

    Recognize achievements or positive changes in managing your spending behavior, as reflected in the input data and in the context of today's goals. Offer encouragement and suggestions for maintaining or improving these behaviors.

    🔎 Noteworthy Behavioral Observations

    Highlight significant behavioral trends or observations from your entire data history, including today's data. Emphasize how these insights, in relation to the daily goals, could impact future financial decisions, focusing on both financial management and emotional health.

    This analysis aims to be insightful, concise, and centered on your behavior and feelings related to transactions, using the input data as a foundation. Emojis in section titles enhance clarity and user engagement.
    Note that the mood is either 0 (unhappy) or 1 (good) - don't mention the numeric values, use the words associated with them for human readable responses. If there is no data to generate, don't generate (this includes off topic from financial data to process)"
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
    The aim is to provide a clear, positive financial direction for the day, keeping the message light-hearted yet focused to help start the day with an optimistic financial mindset.
    Note: Remember the goals will be used against the evening insights to check if they were completed so they need to be achievable. Only suggest goals if relevant else dont mention there is no need for the day."
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
  def insight(input, current_goals, context) do
    prompt = ChngeApi.Core.Gpt.Prompt.insight(input, current_goals, context)
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
