defmodule ChngeApi.Core.Python do
  @moduledoc """
    The python helper methods to interact with the system assigned python scripts
    Note: The python was setup to execute through python3, this can be set differently
  """

  # the path to the python scripts
  @main_py_path File.cwd! <> "/lib/scripts"
  @python3 "python3" # python cmd function - might need fiddling as its per env

  @doc """
    Execute a script by passing the script name along with list of args
  """
  def execute_file(file) do
    {result, _} = System.cmd(@python3, [@main_py_path <> "/#{file}.py"])
    case result do
      "" -> {:error, "There was a problem executing the file"}
      _ -> {:ok, result |> String.trim()}
    end
  end

  @doc """
    Execute a script by passing the script name along with list of args
  """
  def execute_file_with_params(file, params) do
    {result, _} = System.cmd(@python3, [@main_py_path <> "/#{file}.py" | params])
    case result do
      "" -> {:error, "There was a problem executing the file"}
      _ -> {:ok, result |> String.trim()}
    end
  end

  @doc """
    Return the list of all the scripts available
  """
  def list_scripts do
    {:ok,
      File.ls!(@main_py_path)
        |> Enum.filter(fn item ->
          String.split(item, ".") |> Enum.at(1) == "py"
        end)
    }
  end
end
