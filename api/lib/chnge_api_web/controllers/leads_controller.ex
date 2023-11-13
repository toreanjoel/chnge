defmodule ChngeApiWeb.LeadsController do
  @moduledoc """
    The leads controller that will be used in order to interact with the public leads endpoint
  """
  use ChngeApiWeb, :controller
  import Plug.Conn

  # The type of leads, the system is responsible for setting it
  # we add all the sources here
  @landing_page "LP"

  # the document key we are updating
  @lead_db_path "lead"
  @meta_data "meta_data"
  @beta_cutoff_timestamp "beta_cutoff_timestamp"

  @doc """
    Add a lead
  """
  # TODO: THIS NEEDS TO BE REFACTORED
  def add_lead(conn, params) do
    # get the current timestamp - epoch server timer
    # TODO: move this out some time and use schema down the line to validate
    case email = Map.get(params, "email") do
      nil ->
        return(conn, 400, %{ "message" => "Failed, make sure to pass email key with with the value", "data" => %{} })
      _ ->
        # TODO: cast to a string
        clean_email = to_string(email)
        # we check if the email is valid
        if validate_email(clean_email) do
          # add source type
          sys_time = :os.system_time(:seconds)
          payload = %{
            "email" => clean_email,
            "source_code" => @landing_page,
            "timestamp" => sys_time,
            "beta_user" => query_beta_user_check(sys_time) || false # here we need to query the timestamp
          }

          # here we make a request to store to firebase
          {status, firebase_resp} = post_lead(payload)

          case status do
            :ok ->
              # response back to the client
              return(conn, 200, %{ "message" => firebase_resp, "data" => %{} })
            _ ->
              # response back to the client
              return(conn, 400, %{ "message" => firebase_resp," data" => %{} })
          end
        else
          # response back to the client
          return(conn, 400, %{ "message" => "Invalid email", "data" => %{} })
        end
    end
  end


  # helper methods to manage responses
  # JSON returned response helper method for the controller functions
  defp return(conn, status, data) do
    conn
      |> put_resp_content_type("application/json")
      |> send_resp(status, Jason.encode!(data))
  end

  # validate email
  defp validate_email(email) do
    regex = ~r/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    Regex.match?(regex, email)
  end

  # note here we are using realtime and not Firestore
  # This is for now but will most likely need to change later
  defp post_lead(data) do
    url = System.get_env("FIREBASE_DB")
      <> @lead_db_path <> "/" <> Base.encode64((Map.get(data, "email"))) <> ".json" # expected to append for Firebase

    {_status, resp} = HTTPoison.put(url, Jason.encode!(
       data
      ))

    case code = resp.status_code do
      200 ->
        {:ok, "Updated DB Successfully"}
      _ ->
        {:error, "There was an error updating the Firebase DB"}
    end
  end

  # check the store if the user is going to be a beta user
  defp query_beta_user_check(timestamp) do
    url = System.get_env("FIREBASE_DB") <> @meta_data <> ".json"
    {_status, resp} = HTTPoison.get(url)
    case code = resp.status_code do
      200 ->
        %{ "beta_cutoff_timestamp" => val} = Jason.decode!(resp.body)
        timestamp < val
      _ ->
        false
    end
  end
end
