defmodule ChngeApi.Core.TimeScheduler do
  @moduledoc """
    The time scheduler to get the time in future relative to a timezone and timestamp
  """
  require Timex

  @doc """
    Get the timestmap to the next 1pm relative to timezone
  """
  def next_one_pm_unix(timestamp, timezone) do
    current_time = Timex.from_unix(timestamp, :seconds) |> Timex.Timezone.convert(Timex.Timezone.get(timezone, Timex.now()))
    one_pm_today = Timex.beginning_of_day(current_time) |> Timex.shift(hours: 12)

    if Timex.before?(current_time, one_pm_today) do
      Timex.to_unix(one_pm_today)
    else
      Timex.to_unix(Timex.shift(one_pm_today, days: 1))
    end
  end

  @doc """
    Get the timestmap to the next 7am relative to timezone
  """
  def next_seven_am_unix(timestamp, timezone) do
    current_time = Timex.from_unix(timestamp, :seconds) |> Timex.Timezone.convert(Timex.Timezone.get(timezone, Timex.now()))
    seven_am_today = Timex.beginning_of_day(current_time) |> Timex.shift(hours: 7)

    if Timex.before?(current_time, seven_am_today) do
      Timex.to_unix(seven_am_today)
    else
      Timex.to_unix(Timex.shift(seven_am_today, days: 1))
    end
  end

  @doc """
    Get the timestmap to the next 6pm relative to timezone
  """
  def next_six_pm_unix(timestamp, timezone) do
    current_time = Timex.from_unix(timestamp, :seconds) |> Timex.Timezone.convert(Timex.Timezone.get(timezone, Timex.now()))
    six_pm_today = Timex.beginning_of_day(current_time) |> Timex.shift(hours: 18)

    if Timex.before?(current_time, six_pm_today) do
      Timex.to_unix(six_pm_today)
    else
      Timex.to_unix(Timex.shift(six_pm_today, days: 1))
    end
  end

  @doc """
    Get the timestmap to the next midnight relative to timezone
  """
  def next_midnight_unix(timestamp, timezone) do
    current_time = Timex.from_unix(timestamp, :seconds) |> Timex.Timezone.convert(Timex.Timezone.get(timezone, Timex.now()))
    midnight_tomorrow = Timex.beginning_of_day(current_time) |> Timex.shift(days: 1)

    Timex.to_unix(midnight_tomorrow)
  end
end
