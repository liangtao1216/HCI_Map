
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



    // CITI BIKE SAMPLE DATA

    map.addSource('BIKE', {
        'type': 'geojson',
        'data': 'https://media.githubusercontent.com/media/liangtao1216/HCI_Map/main/data/Bike_Sample_Geo.geojson'
    });

    map.addLayer({
        'id': 'BIKE',
        'type': 'line',
        'source': 'BIKE',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible',
        },
        'paint': {
            'line-color': {
                property: 'Flow_Median',
                type: 'interval',
                stops: [
                    [2, '#2979FF'],
                    [14, '#42c3ff'],
                    [41, '#e0e0e0'],
                    [108, '#ffc300'],
                    [307, '#ff3d00'],
                ]
            },

            'line-width': {
                property: 'With_BikeLane',
                type: 'categorical',
                stops: [
                    [0, 1],
                    [1, 3]]
            },

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


map.on('click', 'BIKE', function (e) {
    new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'popupWindow'
    })
        .setLngLat(e.lngLat)
        .setHTML('<h5>' + e.features[0].properties.Street
            + '<br>' + '-----------------------' +
            '</h4>'

            + '<p>' + '<b>SegmentID:</b>' + e.features[0].properties.SegmentID + '</p>'
            + '<p>' + '<b>BikeLane:</b> ' + e.features[0].properties.With_BikeLane + '</p>'
            + '<p>' + '<b>Protected Bike Lane:</b> ' + e.features[0].properties.Protected_Lane + '</p>'
            + '<p>' + '<b>Citi Bike Daily Trips:</b> ' + e.features[0].properties.Flow_Median + '</p>'
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
                [0, '#ff3d00'],
                [20, '#ffc300'],
                [40, '#e0e0e0'],
                [60, '#42c3ff'],
                [80, '#2979FF'],

            ]
        }
        map.setPaintProperty('HCI', 'line-color', CustomColor);
    });



//////////////////////
//switch to Bike Lane
////////////////////// 

$("#mySwitch1").on('change', function () {
    let filterCorridor = ['!=', ['number', ['get', 'With_BikeLane']], 3];

    mySwitch1 = !mySwitch1;
    if (mySwitch1) {
        filterCorridor = ['!=', ['number', ['get', 'With_BikeLane']], 3];
    } //end of if mySwitch

    else {
        filterCorridor = ['==', ['number', ['get', 'With_BikeLane']], 1];
    }
    map.setFilter('BIKE', ['all', filterCorridor]);
});



//////////////////////
//layer control
////////////////////// 

var layers1 = [
    ['BIKE', 'BIKE'],
    ['Vision_Zero', 'Vision-Zero Area'],
    ['Crash', 'Pedestrians Crashes'],
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
        if (map.getLayoutProperty('EL_Infrastructure', 'visibility') == 'visible') {
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


