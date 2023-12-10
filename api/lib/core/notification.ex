defmodule ChngeApi.Core.Notification do
  @moduledoc """
    The module that manages the sending of push notifications
  """
require Logger

  @url "https://fcm.googleapis.com/v1/projects/mob-chnge/messages:send"

  @doc """
    Send off a notification
  """
  def send(%{ title: title, body: body}, device_token, bearer_token) do
    headers = ["Authorization": "Bearer #{bearer_token}", "Content-Type": "application/json"]
    {_status, resp} = HTTPoison.post(@url, Jason.encode!(
      %{
        "message" => %{
          "notification" => %{
            "title" => title,
            "body" => body,
          },
          "token" => device_token
        },
      }
    ), headers)
    case resp.status_code do
      200 ->
        {:ok, "Successfully sent notification"}
      _ ->
        Logger.error("There was an error sending push notification")
        Logger.error(resp)
        {:error, "There was an issue sending notification"}
    end
  end
end
