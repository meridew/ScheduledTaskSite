console.log("app.js is loaded");


$(document).ready(function() {
    $('#spinner').show();
    // Fetch tasks and populate the page
    $.getJSON('/getTasks', function(tasks) {
        for (let task of tasks) {
            let scheduleList = '';
            for(let schedule of task.schedule) {
                scheduleList += `<li>${schedule}</li>`;
            }

            $('#tasks-container').append(`
                <div class="card my-2 bg-dark text-white">
                    <div class="card-header" data-toggle="collapse" href="#collapse-${task.id}">
                        <h5 class="mb-0 d-inline"><strong>${task.name}</strong></h5>
                        <small class="d-block"><strong>Description: </strong>${task.description}</small>
                        <small class="d-block"><strong>Path: </strong>${task.path}</small>
                    </div>
                    <div id="collapse-${task.id}" class="collapse">
                        <div class="card-body">
                            <p><strong>Schedule:</strong></p>
                            <ul>${scheduleList}</ul>
                            <p class="mt-2"><strong>Last Run Time: </strong>${task.lastRunTime}</p>
                            <p><strong>Next Run Time: </strong>${task.nextRunTime}</p>
                            <button class="btn btn-primary run-button mt-2" data-task-id="${task.id}">Run</button>
                        </div>
                    </div>
                </div>
            `);
        }

        // Add click handlers to the Run buttons
        $('.run-button').click(function() {
            let taskId = $(this).data('task-id');
            $.get(`/runTask/${encodeURIComponent(taskId)}`, function(response) {
                alert(response.message);
            });
        });

        $('#spinner').hide();
    });

    $('#theme-toggle').click(function(event) {
        event.preventDefault(); // Prevent page reload
        event.stopPropagation();
        $('body').toggleClass('light-theme');
    });
      

    // Add input event listener to the search bar to filter the tasks
    $('#search-input').on('input', function() {
        let searchVal = $(this).val().toLowerCase();
        $('.card').each(function() {
            let taskName = $(this).find('h5').text().toLowerCase();
            let taskDescription = $(this).find('.card-header > small').text().toLowerCase();
            if (taskName.includes(searchVal) || taskDescription.includes(searchVal)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});

