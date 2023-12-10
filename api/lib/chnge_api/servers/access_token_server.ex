defmodule ChngeApi.Servers.AccessTokenServer do
  @doc """
    Generate a taken used for service account REST access. Generate new token on timeout
  """
  use GenServer
  require Logger

  # function scripts
  @firebase_auth_token "firebase_gen_auth_token"

  # Override the `start_link` function as before
  def start_link(args = %{}) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  # Initialize the state of the server
  def init(state) do
    # init fetch token and set state
    {status, token} = generate_token()

    # start the process to generate a new token evert 1h
    # TODO: This might not be needed - better to refresh when needed
    # refresh every hour
    :timer.send_interval(3_600_000, :refresh_token)

    token = case status do
      :ok -> token
      _ -> nil
    end

    # return and set the new token to the state
    {:ok, Map.put(state, :token, token)}
  end

  # Request token call
  def handle_call(:get_token, _, state) do
    {:reply, state, state}
  end

  # we have a refresh token that we can use - avail for others to call if needed later
  # TODO: make this private later?
  def handle_info(:refresh_token, state) do
    {status, token} = generate_token()

    token = case status do
      :ok -> token
      _ -> nil
    end

    # we update the state with the new generated token
    new_state = Map.put(state, :token, token)

    {:noreply, new_state}
  end

  # We generate the token here from teh service accout
  #TODO: this will expire, either reuse or keep making a new instance on call
  defp generate_token() do
    ChngeApi.Core.Python.execute_file(@firebase_auth_token)
  end
end
