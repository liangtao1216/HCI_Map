
////////////////////////
//initiate mapbox
////////////////////////
mapboxgl.accessToken = 'pk.eyJ1IjoibGlhbmd0YW8xMjE2IiwiYSI6ImNraWZ4cmVkYTA4ZmUycW10eGk3ZTFuajEifQ.sAZWQbIf5fYoDyAKBrIAFw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-74.0059, 40.7128],
    zoom: 10
});

$("#legend-1").hide();
$("#legend-2").hide();
$("#legend-3").hide();
$("#legend-4").hide();

////////////////////////
// add data layers
//////////////////////// 
map.on('load', () => {





    // Population
    map.addSource('ct2020Pop', {
        'type': 'geojson',
        'data': 'https://media.githubusercontent.com/media/liangtao1216/HCI_Map/main/data/ct2020Pop.geojson'
    });
    map.addLayer({
        'id': 'Pop',
        'type': 'fill',
        'source': 'ct2020Pop',
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'PopDen'],

                0,
                '#BDBDBD',
                25,
                '#9E9E9E',
                50,
                '#757575',
                100,
                '#616161',
                150,
                '#424242',
                200,
                '#212121',
            ],
            'fill-opacity': 0.9
        },
    });

    // Covid-19 death rate
    map.addSource('Covid-19', {
        'type': 'geojson',
        'data': 'https://media.githubusercontent.com/media/liangtao1216/HCI_Map/main/data/covid19MODZCTA.geojson'
    });
    map.addLayer({
        'id': 'Covid-19-DeathRate',
        'type': 'fill',
        'source': 'Covid-19',
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'COVID_DEATH_RATE'],

                0,
                '#D7CCC8',
                300,
                '#BCAAA4',
                400,
                '#A1887F',
                500,
                '#795548',
                600,
                '#5D4037',
                700,
                '#3E2723',
            ],
            'fill-opacity': 0.9
        },
    });




    // Ped and cyclist injured and death
    map.addSource('Crash', {
        'type': 'geojson',
        'data': 'https://media.githubusercontent.com/media/liangtao1216/HCI_Map/main/data/PedCrash2022Geo.geojson'
    });
    map.addLayer({
        'id': 'Crash',
        'type': 'circle',
        'source': 'Crash',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'PedCrash']],
                1,
                4,
                5,
                24
            ],
            'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'PedCrash']],
                0,
                '#2DC4B2',
                1,
                '#3BB3C3',
                2,
                '#669EC4',
                3,
                '#8B88B6',
                4,
                '#A2719B',
                5,
                '#AA5E79'
            ],
            'circle-opacity': 0.8,
        }
    });

    // Healthy Corridor Index

    map.addSource('HCI', {
        'type': 'geojson',
        'data': 'https://media.githubusercontent.com/media/liangtao1216/HCI_Map/main/data/HCI_Corridor.geojson'
    });

    let index = 'HCI';
    map.addLayer({
        'id': 'HCI',
        'type': 'line',
        'source': 'HCI',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible',
        },
        'paint': {
            'line-color': {
                property: index,
                type: 'interval',
                stops: [
                    [20, '#ff3d00'],
                    [40, '#ffc300'],
                    [60, '#e0e0e0'],
                    [80, '#42c3ff'],
                    [100, '#2979FF'],
                ]
            },
            'line-width': {
                property: 'Carto_Disp',
                type: 'categorical',
                stops: [
                    [10, 4],
                    [20, 3],
                    [30, 2],]
            },
            'line-opacity': {
                property: 'Carto_Disp',
                type: 'categorical',
                stops: [
                    [0, 0.4],
                    [10, 0.9],
                    [20, 0.9],
                    [30, 0.9],]
            }

        },
        //'filter': ['all', filterCorridor]

    });
    // Vison Zero
    map.addSource('Vision_Zero', {
        'type': 'geojson',
        'data': 'https://media.githubusercontent.com/media/liangtao1216/HCI_Map/main/data/VZV_Priority_Zones_or_Areas.geojson'
    });
    map.addLayer({
        'id': 'Vision_Zero',
        'type': 'fill',
        'source': 'Vision_Zero',
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'fill-color': '#ffffff',
            'fill-opacity': 0.6
        }
    });
});

////////////////////////
// pop up
//////////////////////// 


map.on('click', 'HCI', function (e) {
    new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'popupWindow'
    })
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + e.features[0].properties.Street
            + '<br>' + '-----------------------' +
            '</h4>'

            + '<p>' + '<b>SegmentID:</b>' + e.features[0].properties.SegmentID + '</p>'
            + '<p>' + '<b>EL-Space:</b>' + e.features[0].properties.ELSPACE + '</p>'
            + '<p>' + '<b>Population:</b>' + e.features[0].properties.TotalPopulation + '</p>'
            + '<p>' + '<b>HCI:</b> ' + e.features[0].properties.HCI + '</p>'
            + '<p>' + '<b>Socio-economic:</b> ' + e.features[0].properties.SE + '</p>'
            + '<p>' + '<b>Education:</b> ' + e.features[0].properties.E + '</p>'
            + '<p>' + '<b>Natural Environment:</b> ' + e.features[0].properties.NE + '</p>'
            + '<p>' + '<b>Neighborhood:</b> ' + e.features[0].properties.N + '</p>'
            + '<p>' + '<b>Transportation:</b> ' + e.features[0].properties.T + '</p>'
        )
        .addTo(map);
});

map.on('click', 'Crash', function (e) {
    new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'popupWindow'
    })
        .setLngLat(e.lngLat)
        .setHTML(
            `<p><b>PedCrash:</b><br>${e.features[0].properties.PedCrash}</p>`
        )
        .addTo(map);
});

function myPopup(idName) {
    var popup = document.getElementById(idName);
    popup.classList.toggle("show");
}





////////////////////////
// filter corridor type
////////////////////////
document
    .getElementById('selectIndex')
    .addEventListener('change', (event) => {
        const select = event.target.value;
        // update the map filter
        if (select === 'hci') {
            index = 'HCI';
        } else if (select === 'se') {
            index = 'SE';
        } else if (select === 'e') {
            index = 'E';
        } else if (select === 'ne') {
            index = 'NE';
        } else if (select === 'n') {
            index = 'N';
        } else if (select === 't') {
            index = 'T';
        }



        let CustomColor = {
            property: index,
            type: 'interval',
            stops: [
                [20, '#ff3d00'],
                [40, '#ffc300'],
                [60, '#e0e0e0'],
                [80, '#42c3ff'],
                [100, '#2979FF'],

            ]
        }
        map.setPaintProperty('HCI', 'line-color', CustomColor);
    });



//////////////////////
//switch to el-space
////////////////////// 

$("#mySwitch1").on('change', function () {
    let filterCorridor = ['!=', ['number', ['get', 'ELSPACE']], 3];

    mySwitch1 = !mySwitch1;
    if (mySwitch1) {
        filterCorridor = ['!=', ['number', ['get', 'ELSPACE']], 3];
    } //end of if mySwitch

    else {
        filterCorridor = ['==', ['number', ['get', 'ELSPACE']], 1];
    }
    map.setFilter('HCI', ['all', filterCorridor]);
});


//////////////////////
//switch to line-width change
////////////////////// 

// $("#mySwitch2").on('change', function () {

//     mySwitch2 = !mySwitch2;
//     let CustomWidth = {
//         property: 'Carto_Disp',
//         type: 'categorical',
//         stops: [
//             [10, 6],
//             [20, 4],
//             [30, 2],
//             [0, 1]
//         ]
//     }
//     let CustomOpacity = {
//         property: 'Carto_Disp',
//         type: 'categorical',
//         stops: [
//             [0, 0.5],
//             [10, 0.9],
//             [20, 0.9],
//             [30, 0.9],]
//     }

//     if (mySwitch2) {
//         CustomWidth = {
//             property: 'Carto_Disp',
//             type: 'categorical',
//             stops: [
//                 [10, 6],
//                 [20, 4],
//                 [30, 2],
//                 [0, 1]
//             ]
//         }
//         CustomOpacity = {
//             property: 'Carto_Disp',
//             type: 'categorical',
//             stops: [
//                 [0, 0.5],
//                 [10, 0.9],
//                 [20, 0.9],
//                 [30, 1],]
//         }

//     } //end of if mySwitch

//     else {
//         CustomWidth = {
//             property: 'PopRank',
//             type: 'interval',
//             stops: [
//                 [0, 1],
//                 [25, 1],
//                 [50, 3],
//                 [75, 20],
//             ]
//         }
//         CustomOpacity = {
//             property: 'PopRank',
//             type: 'interval',
//             stops: [
//                 [0, 1]
//                 [25, 1],
//                 [50, 1],
//                 [75, 1],
//             ]
//         }

//    }
//     map.setPaintProperty('HCI', 'line-width', CustomWidth);
//     map.setPaintProperty('HCI', 'line-opacity', CustomOpacity);

// });


//////////////////////
//layer control
////////////////////// 

var layers1 = [
    ['HCI', 'HCI'],
    ['Vision_Zero', 'Vision-Zero Area'],
    ['Crash', 'Pedestrians Crashes'],
    ['Pop', 'Population'],
    ['Covid-19-DeathRate', 'Covid-19 Death Rate']
];


map.on('load', function () {

    for (i = 0; i < layers1.length; i++) {
        $("#layers-control1").append("<a href='#' class=' button-default' id='" + layers1[i][0] + "'>" + layers1[i][1] + "</a>"); // see http://api.jquery.com/append/
    }

    $("#layers-control1>a").on('click', function (e) {
        var clickedLayer = e.target.id;

        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
        console.log(visibility);

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            $(e.target).removeClass('active');
        } else {
            $(e.target).addClass('active');
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
        //change legend
        if (map.getLayoutProperty('Pop', 'visibility') == 'visible') {
            $("#legend-1").show();
        } else {
            $("#legend-1").hide();
        }
        if (map.getLayoutProperty('Covid-19-DeathRate', 'visibility') == 'visible') {
            $("#legend-2").show();
        } else {
            $("#legend-2").hide();
        }
        if (map.getLayoutProperty('Crash', 'visibility') == 'visible') {
            $("#legend-3").show();
        } else {
            $("#legend-3").hide();
        }
        if (map.getLayoutProperty('Q5_Average', 'visibility') == 'visible') {
            $("#legend-4").show();
        } else {
            $("#legend-4").hide();
        }
    });


});






/////////////////////////////////
// Add the search bar to the map.
////////////////////////////////

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


