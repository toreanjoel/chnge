defmodule ChngeApi.Core.Notification do
  @moduledoc """
    The module that manages the sending of push notifications
  """
require Logger

  @url "https://fcm.googleapis.com/v1/projects/mob-chnge/messages:send"
  @push_titles %{
    morning: [
      "🌤️ Rise and Shine! Set Your Financial Goals Today!",
      "New Day, New Goals! What's Your Financial Plan?",
      "🌅 Morning Motivation: Time to Plan Your Finances!",
      "🍳 Breakfast Time! Cook Up Some Financial Goals!",
      "🌞 Good Morning! Let's Get Financially Organized!",
      "🌄 Start Your Day Right: Time for Financial Focus!",
      "Coffee & Finances: Plan Your Day's Spending!",
      "🌼 A Fresh Start: Outline Today's Money Moves!",
      "🐦 Early Bird Gets the Worm: Set Your Financial Targets!",
      "📅 Today's Agenda: Smart Money Management!"
    ],
    afternoon: [
      "🌞 Midday Money Moment: Stay on Track!",
      "🥗 Lunch Break Check: How's Your Budget?",
      "🕒 Halfway There! Financial Check-In Time!",
      "🌻 Sunny Midday: Perfect Time for a Finance Review!",
      "🍔 Lunchtime Ledger: Keep Up with Your Budget!",
      "⏰ Afternoon Alert: Quick Finance Recap!",
      "📈 Midday Finance: Are You Meeting Your Goals?",
      "Coffee Break Finances: Quick Money Check!",
      "📚 Afternoon Analysis: Stay Financially Informed!",
      "🎯 Afternoon Goals: Keep Your Finances Sharp!"
    ],
    evening: [
      "🌇 Evening Finance Round-Up: Log Today's Spending",
      "🌆 Sunset Spending Review: Ready to Recap?",
      "🌙 Good Evening! Time for a Financial Wind Down",
      "🍽️ Dinner Time: Reflect on Today's Finances",
      "🌠 Starry Finance: Evening Check-In Time!",
      "🛒 Evening Ledger: Did You Stick to the Budget?",
      "📖 Nighttime Numbers: Review Today's Expenses",
      "🌌 Galaxy of Finances: Evening Recap Time!",
      "🎑 Evening Reflection: How Did You Do Financially?",
      "🌉 Bridge Your Day to Night: Evening Money Review"
    ],
    night: [
      "🌜 Nightcap Finance: Today's Overview is Ready!",
      "🌃 Goodnight Finances: Check Your Day's Summary",
      "🌉 Bridge to Tomorrow: Day's Financial Recap",
      "🛏️ Bedtime Budget: Review Your Financial Day",
      "🌟 Starry Summary: Your Daily Finance Wrap-Up",
      "📅 Day's End: Time to Reflect on Your Spending",
      "🌙 Moonlit Money: Unveil Today's Financial Story",
      "🌌 Galactic Gains: End-of-Day Financial Overview",
      "🌒 Crescent Close: Wrapping Up Your Financial Day",
      "🛌 Sleep Tight Finance: Day in Review"
    ]
  }
  @push_body %{
    morning: [
      "Kickstart your day with a quick finance check-in. Ready to save and spend smart?",
      "Good morning! Time to review and set your financial intentions for the day. 📊",
      "Start your day with a clear financial plan. What are your top priorities today?",
      "Balance your budget over breakfast. Ready for a financially savvy day?",
      "A new day of opportunities! Let's make smart money moves together. 💸",
      "Plan, track, and achieve. Set your financial goals this morning!",
      "Let's make today count financially! What are your money goals?",
      "Morning is the best time to organize your finances. Let's dive in! 💼",
      "Welcome a new day with new financial goals. Ready to take charge?",
      "Plan your spending and savings for the day. Stay ahead financially!"
    ],
    afternoon: [
      "Take a quick break to review your spending so far. All on track?",
      "Lunchtime is the perfect time to reflect on your morning spending. 🌮",
      "How are your day's financial goals shaping up? Quick afternoon check!",
      "Sunny skies and sound spending. Let's do a midday financial review.",
      "Grab your lunch and your budget! Let's see how you're doing today.",
      "Time flies! Let's see how your budget is holding up this afternoon.",
      "Midday check: Are you sticking to your financial plan? 📝",
      "Coffee in hand? Great! Let's do a quick financial check-in.",
      "Afternoon wisdom: Take a moment to review your finances.",
      "Keep your money goals in sight. How's your afternoon spending going?"
    ],
    evening: [
      "The day is wrapping up. Let's log and review your spending for the day. 📚",
      "As the sun sets, take a moment to review and reflect on your financial choices.",
      "Unwind with a quick review of your day's financial decisions. 🌜",
      "Dinner's ready and so is your financial summary. How did you do today?",
      "Under the evening stars, let's check how your budget fared today. ✨",
      "Evening check: Did your spending match your budget plans?",
      "Cozy evening? Perfect for a quick glance at today's financials.",
      "Night skies, financial ties. Let's review your day's money moves.",
      "Reflect on your financial decisions today. Ready for a quick review?",
      "Bridge the gap between today and tomorrow with an evening budget check."
    ],
    night: [
      "End your day with a look at your financial summary. Sleep well knowing you're on track! 💤",
      "Before you say goodnight, take a peek at today's financial highlights.",
      "Bridge your financial learnings today to a better tomorrow. Nightly recap ready!",
      "Bedtime but first, a quick budget review. How did today go financially?",
      "Under the stars, let's summarize your day's financial journey. 🌠",
      "As the day closes, take a moment to reflect on your spending and saving.",
      "Moonlit review: What's the story of your spending today?",
      "Your financial universe for the day is ready for a review. Take a look!",
      "As the moon rises, let's wrap up your financial day. Ready for a quick glance?",
      "Rest easy after reviewing your financial strides made today. Goodnight! 🌛"
    ]
  }


  @doc """
    Send off a notification
  """
  def send(%{ title: title, body: body, data: data}, device_token, bearer_token) do
    headers = ["Authorization": "Bearer #{bearer_token}", "Content-Type": "application/json"]
    # we make sure there is some data to fall back on
    extra_data = if is_nil(data), do: %{}, else: data
    {_status, resp} = HTTPoison.post(@url, Jason.encode!(
      %{
        "message" => %{
          "notification" => %{
            "title" => title,
            "body" => body,
          },
          "data" => extra_data,
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

  @doc """
    We pass throught the type i.e title or description and the time of day (morning, afternoon, evening, night)

    The caller will get a random pair give a few options we have preset for their push notification data
  """
  def random_morning_notification() do
    pick_random_item(:morning)
  end

  def random_afternoon_notification() do
    pick_random_item(:afternoon)
  end

  def random_evening_notification() do
    pick_random_item(:evening)
  end

  def random_night_notification() do
    pick_random_item(:night)
  end

  # pick from the titles and descriptions, random 1 based off the group
  # group is titles and descriptions
  defp pick_random_item(group) do
    titles = Map.get(@push_titles, group)
    body = Map.get(@push_body, group)

    # return random items
    %{
      title: Enum.random(titles),
      body: Enum.random(body),
    }
  end
end
