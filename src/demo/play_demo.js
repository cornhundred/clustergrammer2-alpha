/* eslint-disable */

var run_segment = require('./run_segment');
var play_intro = require('./play_intro');
var play_zoom = require('./play_zoom');
var play_reset_zoom = require('./play_reset_zoom');
var play_reorder_row = require('./play_reorder_row');
var play_reorder_buttons = require('./play_reorder_buttons');
var play_search = require('./play_search'); 
var play_filter = require('./play_filter');
var quick_cluster = require('./quick_cluster');
var play_groups = require('./play_groups');
var play_categories = require('./play_categories'); 
var play_conclusion = require('./play_conclusion');
var toggle_play_button = require('./toggle_play_button');

module.exports = function play_demo(){

  var cgm = this;
  var params = cgm.params;

  if (d3.select(params.root+' .running_demo').empty()){

    // prevent more than one demo from running at once 
    d3.select(params.root+' .play_button')
      .classed('running_demo', true);

    toggle_play_button(params, false);

    // intro text 
    var inst_time = 750;

    inst_time = run_segment(params, inst_time, play_intro);
    inst_time = run_segment(params, inst_time, play_zoom);
    inst_time = run_segment(params, inst_time, play_reset_zoom);
    inst_time = run_segment(params, inst_time, play_groups);
    inst_time = run_segment(params, inst_time, play_categories);
    inst_time = run_segment(params, inst_time, play_reorder_row);
    inst_time = run_segment(params, inst_time, play_reorder_buttons);
    inst_time = run_segment(params, inst_time, play_search);
    inst_time = run_segment(cgm, inst_time, play_filter);
    inst_time = run_segment(params, inst_time, quick_cluster);
    inst_time = run_segment(params, inst_time, play_conclusion);

  }

};