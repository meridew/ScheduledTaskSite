$tasks = Get-ScheduledTask # -TaskPath "\BlackBerry UEM\"

$datas = @()

foreach($task in $tasks)
{
    $info = $task | Get-ScheduledTaskInfo

    $triggers = @()

    if($task.Triggers.Count -eq 0)
    {
        $schedule = "None"

        $triggers += $schedule
    }
    else
    {
        foreach($trigger in $task.Triggers)
        {
            $schedule = if ($trigger.DaysInterval) {
                          "Every $($trigger.DaysInterval) days at $($trigger.StartBoundary)"
                      } elseif ($trigger.WeeksInterval) {
                          "Every $($trigger.WeeksInterval) weeks on $($trigger.DaysOfWeek) at $($trigger.StartBoundary)"
                      } elseif ($trigger -is [CimInstance] -and $trigger.CimClass.CimClassName -eq "DailyTrigger") {
                          "Daily at $($trigger.StartBoundary)"
                      } elseif ($trigger -is [CimInstance] -and $trigger.CimClass.CimClassName -eq "WeeklyTrigger") {
                          "Weekly on $($trigger.DaysOfWeek) at $($trigger.StartBoundary)"
                      } elseif ($trigger -is [CimInstance] -and $trigger.CimClass.CimClassName -eq "MonthlyTrigger") {
                          "Monthly on days $($trigger.DaysOfMonth) at $($trigger.StartBoundary)"
                      } else {
                          "Custom trigger"
                      }
            $triggers += $schedule
        }
    }
    
    $data = [PSCustomObject]@{
        "id"          = $task.TaskName.ToLower().Replace(" ", "_")
        "name"        = $task.TaskName
        "path"        = "$(hostname)\Task Scheduler$($task.TaskPath)"
        "description" = $task.Description
        "state"       = $info.State
        "lastRunTime" = $info.LastRunTime
        "nextRunTime" = $info.NextRunTime
        "schedule"    = $triggers
    }

    if($null -eq $data.lastRunTime)
    {
        $data.lastRunTime = "Never"
    }
    else 
    {
        $data.lastRunTime = $data.lastRunTime.ToString()
    }

    if($null -eq $data.nextRunTime)
    {
        $data.nextRunTime = "Never"
    }
    else 
    {
        $data.nextRunTime = $data.nextRunTime.ToString()
    }

    $datas += $data
}

$datas = $datas | Sort -descending -Property TaskName

return $datas | ConvertTo-Json -Compress
