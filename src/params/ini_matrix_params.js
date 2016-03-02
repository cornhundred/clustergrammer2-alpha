var utils = require('../utils');
var initialize_matrix = require('../initialize_matrix');

module.exports = function set_matrix_params(config, params){

  params.matrix = {};
  params.matrix.tile_colors = config.tile_colors;
  params.matrix.bar_colors = config.bar_colors;
  params.matrix.outline_colors = config.outline_colors;
  params.matrix.hlight_color = config.highlight_color;
  params.matrix.tile_title = config.tile_title;
  params.matrix.show_tile_tooltips = config.show_tile_tooltips;
  params.matrix.make_tile_tooltip = config.make_tile_tooltip;

  // initialized clicked tile and rows
  params.matrix.click_hlight_x = -666;
  params.matrix.click_hlight_y = -666;
  params.matrix.click_hlight_row = -666;
  params.matrix.click_hlight_col = -666;

  // definition of a large matrix - based on number of links
  // below this cutoff reordering is done with transitions
  params.matrix.def_large_matrix = 10000;

  params.matrix.opacity_function = config.opacity_scale;

  params.network_data.row_nodes_names = _.pluck(params.network_data.row_nodes, 'name');
  params.network_data.col_nodes_names = _.pluck(params.network_data.col_nodes, 'name');

  var col_nodes = params.network_data.col_nodes;
  var row_nodes = params.network_data.row_nodes;

  var tmp;
  var row_nodes_names = _.pluck(row_nodes, 'name');
  tmp = row_nodes_names.sort();
  var row_alpha_index = _.map(tmp, function(d){
    return params.network_data.row_nodes_names.indexOf(d);
  });

  var col_nodes_names = _.pluck(col_nodes, 'name');
  tmp = col_nodes_names.sort();
  var col_alpha_index = _.map(tmp, function(d){
    return params.network_data.col_nodes_names.indexOf(d);
  });  

  // Define Orderings
  params.matrix.orders = {
    // ini
    alpha_row: col_alpha_index,
    alpha_col: row_alpha_index,
    // rank
    rank_row: d3.range(params.viz.num_col_nodes).sort(function (a, b) {
      return col_nodes[b].rank - col_nodes[a].rank;
    }),
    rank_col: d3.range(params.viz.num_row_nodes).sort(function (a, b) {
      return row_nodes[b].rank - row_nodes[a].rank;
    }),
    // clustered
    clust_row: d3.range(params.viz.num_col_nodes).sort(function (a, b) {
      return col_nodes[b].clust - col_nodes[a].clust;
    }),
    clust_col: d3.range(params.viz.num_row_nodes).sort(function (a, b) {
      return row_nodes[b].clust - row_nodes[a].clust;
    })
  };

  // check if rankvar order is available 
  if (_.has(params.network_data.row_nodes[0],'rankvar') ){
    params.matrix.orders.rankvar_row = d3.range(params.viz.num_col_nodes).sort(function (a, b) {
      return col_nodes[b].rankvar - col_nodes[a].rankvar;
    });

    params.matrix.orders.rankvar_col = d3.range(params.viz.num_row_nodes).sort(function (a, b) {
      return row_nodes[b].rankvar - row_nodes[a].rankvar;
    });
  }

  // // define class ordering - define on front-end
  // if (utils.has(col_nodes[0],'cl')){

  //   // the order should be interpreted as the nth node should be positioned here
  //   // in the order

  //   var tmp_col_nodes = _.sortBy(col_nodes,'cl')

  //   var ordered_col_names = []
  //   for (var i=0; i< tmp_col_nodes.length; i++){
  //     ordered_col_names.push( tmp_col_nodes[i].name );
  //   }

  //   var order_col_class = []
  //   for (var i=0; i< col_nodes.length; i++){
  //     var inst_col_name = ordered_col_names[i];
  //     order_col_class.push( _.indexOf( params.network_data.col_nodes_names, inst_col_name) );
  //   }

  //   params.matrix.orders.class_row = order_col_class;
  // }

  if (utils.has(col_nodes[0], 'cl_index')) {
    params.matrix.orders.class_row = d3.range(params.viz.num_col_nodes).sort(function (a, b) {
      return col_nodes[b].cl_index - col_nodes[a].cl_index;
    });
  }


  if (utils.has(params.network_data, 'all_links')) {
    params.matrix.max_link = _.max(params.network_data.all_links, function (d) {
      return Math.abs(d.value);
    }).value;
  } else {
    params.matrix.max_link = _.max(params.network_data.links, function (d) {
      return Math.abs(d.value);
    }).value;
  }

  if (config.input_domain === 0) {
    if (params.matrix.opacity_function === 'linear') {
      params.matrix.opacity_scale = d3.scale.linear()
        .domain([0, Math.abs(params.matrix.max_link)]).clamp(true)
        .range([0.0, 1.0]);
    } else if (params.matrix.opacity_function === 'log') {
      params.matrix.opacity_scale = d3.scale.log()
        .domain([0.001, Math.abs(params.matrix.max_link)]).clamp(true)
        .range([0.0, 1.0]);
    }
  } else {
    if (params.matrix.opacity_function === 'linear') {
      params.matrix.opacity_scale = d3.scale.linear()
        .domain([0, config.input_domain]).clamp(true)
        .range([0.0, 1.0]);
    } else if (params.matrix.opacity_function === 'log') {
      params.matrix.opacity_scale = d3.scale.log()
        .domain([0.001, config.input_domain]).clamp(true)
        .range([0.0, 1.0]);
    }
  }


  if (utils.has(params.network_data.links[0], 'value_up') || utils.has(params.network_data.links[0], 'value_dn')) {
    params.matrix.tile_type = 'updn';
  } else {
    params.matrix.tile_type = 'simple';
  }

  if (utils.has(params.network_data.links[0], 'highlight')) {
    params.matrix.highlight = 1;
  } else {
    params.matrix.highlight = 0;
  }

  params.matrix.matrix = initialize_matrix(params.network_data);

  return params;
};