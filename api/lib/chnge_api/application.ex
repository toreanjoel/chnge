defmodule ChngeApi.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      ChngeApiWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:chnge_api, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: ChngeApi.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: ChngeApi.Finch},
      # Start a worker by calling: ChngeApi.Worker.start_link(arg)
      # {ChngeApi.Worker, arg},
      # Start to serve requests, typically the last entry
      ChngeApiWeb.Endpoint,

      # TODO: Process that checks user processes are up
      {ChngeApi.Servers.UserJobServer, %{}}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ChngeApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ChngeApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
