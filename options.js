
var rules_list = [];
var events = {};
var rules_table = $('#rules');
var add_form = $('#add_form');

// Saves rules to localStorage.
function save_rule() {
    var rule = add_form.serializeJSON();
    add_form.children('.control-group').removeClass('error');

    if(rule.selector === '') {
        update_status('Missing destination!', 'alert-error');
        add_form.find('input[name=selector]').parent().addClass('error');
        return false;
    }
    if(rule.replacement === '') {
        update_status('Missing replacement HTML!', 'alert-error');
        add_form.find('input[name=replacement]').parent().addClass('error');
        return false;
    }
    
    try {
        console.log(rule);
        rules_list.push(rule);
        localStorage.rules = JSON.stringify(rules_list);
        rules_table.append(ich.rule(rule));
    } catch(err) {
        console.error(err);
    }
     
    update_status("Rules saved.", 'alert-success');
    return false;
}

function update_status(text, alert_class) {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.text(text);
    status.removeClass('alert-success').removeClass('alert-error').addClass(alert_class);
    status.slideDown();
    setTimeout(function() {
        status.fadeOut();
    }, 1500);
}

// Restores data from localStorage.
function restore_data() {
    console.log('Restoring rules from localStorage');

    try {
        rules_list = JSON.parse(localStorage.rules);
        events = JSON.parse(localStorage.events);
    } catch(err) {
        rules_list = [];
        events = {};
        return;
    }
    $.each(rules_list, function(i, rule) {
        console.log(rule);
        $(rules_table).append(ich.rule(this));
    });

    $.each(events, function(event_name) {
      var select = $('select[name=event_type]');
      select.append('<option name=' + event_name + '>' + event_name + '</option>');
    });
}

(function($){
    $.fn.serializeJSON = function() {
        var json = {};
        $.map($(this).serializeArray(), function(n, i){
            json[n['name']] = n['value'];
        });
        return json;
    };
})( jQuery );

$(function() {
    restore_data();

    // Submit handler for #add_form
    $('#add_form').bind('submit', save_rule);

    // Handler for delete buttons
    $('.delete-rule').live('click', function() {
        var tr = $(this).parent().parent();
        var index = tr.index();
        console.error('deleting rule ' + index);

        console.log(rules_list);

        // Delete row
        tr.remove();

        console.log(rules_list);

        // update localStorage
        rules_list.splice(index, 1);
        console.log(rules_list);
        localStorage.rules = JSON.stringify(rules_list);

        return false;
    });
});
