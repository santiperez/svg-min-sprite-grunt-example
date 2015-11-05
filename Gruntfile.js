'use strict';
var path = require('path');


module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var buildProperties = {
        appName: 'svg-sprite-example',
        frontFolder: 'public',
        imagesInFolder:'<%= config.frontFolder %>/images/in',
        imagesOutFolder:'<%= config.frontFolder %>/images/out',
        stylesFolder:'<%= config.frontFolder %>/stylesheets'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('./package.json'),
        config: buildProperties,
        jshint: {
            options: {
                force: true,
                curly: true, // Require {} for every new block or scope.
                eqeqeq: false, // Require triple equals i.e. `===`.
                eqnull: true,
                latedef: false, // Prohibit variable use before definition.
                unused: false, // Warn unused variables.
                undef: true, // Require all non-global variables be declared before they are used.
                maxparams: 15,
                browser: true, // Standard browser globals e.g. `window`, `document`.
                globals: {
                    jQuery: true,
                    $: true,
                    angular: true,
                    alert: true,
                    console: true,
                    _: true,
                    NotificationFx: true,
                    Modernizr: true,
                    popup: true,
                    showNotAddedCartNotification: true,
                    showNotification: true,
                    self: true,
                    FB: true,
                    IosSlider: true,
                    sliderProductos: true
                },
                ignores: ['<%= config.src %>plugins.js']
            },
            uses_defaults: ['<%= config.src %>*.js']
        },
        clean: {
            sprite:{
                src: ['<%= config.imagesOutFolder %>/*.svg']
            }
        },
        svgmin: {
            options: {
                full: true,
                plugins: [//https://github.com/svg/svgo/blob/cdb7fffc7631a809a531d280667fa07a48eb2ea0/.svgo.yml
                    {removeDoctype:true},
                    {removeXMLProcInst:true},
                    {removeComments:true},
                    {removeMetadata:true},
                    {removeEditorsNSData:true},
                    {cleanupAttrs:true},
                    {convertStyleToAttrs:true},
                    {cleanupIDs:true},
                    {removeRasterImages:true}, //this reduces the size considerably
                    {removeUselessDefs:true},
                    {cleanupNumericValues:true},
                    {cleanupListOfValues:true},
                    {convertColors:true},
                    {removeUnknownsAndDefaults:true},
                    {removeNonInheritableGroupAttrs:true},
                    {removeUselessStrokeAndFill:true},
                    {removeViewBox:true},
                    {cleanupEnableBackground:true},
                    {removeHiddenElems:true},
                    {removeEmptyText:true},
                    {convertShapeToPath:true},
                    {moveElemsAttrsToGroup:true},
                    {moveGroupAttrsToElems:true},
                    {collapseGroups:true},
                    {convertPathData:true},
                    {convertTransform:true},
                    {removeEmptyAttrs:true},
                    {removeEmptyContainers:true},
                    {mergePaths:true},
                    {removeUnusedNS:true},
                    {transformsWithOnePath:false},
                    {sortAttrs:true},
                    {removeTitle:true},
                    {removeDesc:true}
                ]
            },
            common: {
                files: [{
                    expand: true,
                    cwd: '<%= config.imagesInFolder %>',
                    src: '*.svg',
                    dest: '<%= config.imagesOutFolder %>'
                }
                ]
            }
        },
        svg_sprite: {
            common: {
                // Target basics
                expand: true,
                cwd: '<%= config.imagesOutFolder %>',
                src: ['*.svg'],
                dest: '<%= config.stylesFolder %>',
                // Target options
                options: {
                    shape               : {
                        dimension       : {
                            precision : 0,
                            attributes : false
                        },
                        spacing: {         // Add padding
                            padding: 6
                        }
                    },
                    mode: {
                        view: {
                            bust: false,
                            sprite:'sprite.svg',
                            mixin:'svg-sprite',
                            render: {
                                scss: {
                                    dest:'_sprite.scss'
                                },
                                css: {
                                    dest:'sprite.css'
                                },
                                less: {
                                    dest:'sprite.less'
                                },
                                styl: {
                                    dest:'sprite.styl'
                                } //
                            },
                            dest: './'
                        },
                        symbol: false// Activate the «symbol» mode
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-svg-sprite');
    grunt.loadNpmTasks('grunt-svgmin');
    // This is required if you use any options.
    grunt.task.run('notify_hooks');

    grunt.registerTask('default', ['clean:sprite','svgmin:common','svg_sprite:common']);

};