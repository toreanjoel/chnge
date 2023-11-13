defmodule ChngeApiWeb.NoAccessController do
  @moduledoc """
    Basic Helper methods that will be used to deal with the no access requests
  """
  use ChngeApiWeb, :controller
  import Plug.Conn

  @not_found_code 404

  @doc """
    The GET route that was tried to be access was not found and the user needs a relevant response
  """
  def get_route_not_found(conn, _params) do
    return(conn, @not_found_code, %{
      "success" => false,
      "message" => "Unable to make a GET request to the given route",
      "data" => %{}
    })
  end

  @doc """
    The POST route that was tried to be access was not found and the user needs a relevant response
  """
  def post_route_not_found(conn, _params) do
    return(conn, @not_found_code, %{
      "success" => false,
      "message" => "Unable to make a POST request to the given route",
      "data" => %{}
    })
  end

  # JSON returned response helper method for the controller functions
  defp return(conn, status, data) do
    conn
      |> put_resp_content_type("application/json")
      |> send_resp(status, Jason.encode!(data))
  end
end
