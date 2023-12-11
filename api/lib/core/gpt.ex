defmodule ChngeApi.Core.Gpt.Prompt do
  @moduledoc """
    This is specific to the prompt alone, we will create the prompt data here
  """

  @doc """
    The prompt around getting insight for the current day generated and optional context added
  """
  def insight(input, prev_insights \\ []) do
    "Based on the financial data provided, analyze and generate insights focusing on patterns and suggestions for improving financial habits.
      The analysis should consider both mood (with 0 indicating a negative mood and 1 indicating a positive mood) and transaction type.
      Return insights in a concise format, enriched with emojis, without any introductory or explanatory text.
      Avoid referencing specific keys like IDs.The response should be clear, detailed, and directly address the patterns and suggestions for future actions.

      Latest Transactions (INPUT):
      #{input}

      Previous Insights (PREV_INSIGHTS):
      #{prev_insights}

      Use the placeholders INPUT and PREV_INSIGHTS to populate with the latest transaction data and previous insights, respectively.
      Provide new insights and suggestions for the next day based on this analysis."
  end

  @doc """
    A suggestion that is generated for the prev days insight
  """
  def daily_suggestion(input) do
    # TODO
    "TODO: Add prompt for the daily tips"
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
