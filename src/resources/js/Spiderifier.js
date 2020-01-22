// Source : https://jsfiddle.net/bewithjonam/vsLqhv6c/5/
// Modified by Quentin Drumez
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";

export default function Spiderifier(map, userOptions) {
  var util = {
      each: eachFn,
      map: mapFn,
      mapTimes: mapTimesFn,
      eachTimes: eachTimesFn
    },
    NULL_FUNCTION = function() {},
    options = {
      circleSpiralSwitchover: 9, // show spiral instead of circle from this marker count upwards
      // 0 -> always spiral; Infinity -> always circle
      circleFootSeparation: 40, //related to circumference of circle
      spiralFootSeparation: 50, // related to size of spiral (experiment!)
      spiralLengthStart: 40, // ditto
      spiralLengthFactor: 4, // ditto
      maxMarkers: 20,
      onClick: userOptions.onClick || NULL_FUNCTION,
      createMarkerElement: userOptions.createMarkerElement || NULL_FUNCTION
    },
    twoPi = Math.PI * 2,
    previousMarkers = [];

  // Public:
  this.spiderfy = spiderfy;
  this.unspiderfy = unspiderfy;

  // Private:
  function spiderfy(latLng, markers) {
    var spiderParams = generateSpiderParams(markers.length);

    unspiderfy();

    for (var index = 0; index < markers.length; index++) {
      if (index > options.maxMarkers) break;

      var spiderParam = spiderParams[index],
        elem;

      if (index < options.maxMarkers) {
        elem = options.createMarkerElement(
          spiderParam,
          markers[index],
          index,
          options.onClick
        );
      } else {
        elem = options.createMarkerElement(
          spiderParam,
          null,
          index,
          options.onClick
        )
      }

      previousMarkers.push(
        new mapboxgl.Marker(elem, {
          offset: [spiderParam.x, spiderParam.y]
        })
          .setLngLat(latLng)
          .addTo(map)
      );
    }

    // previousMarkers = util.map(markers, function(marker, index) {
    //   var spiderParam = spiderParams[index],
    //     elem = options.createMarkerElement(
    //       spiderParam,
    //       marker,
    //       index,
    //       options.onClick
    //     );

    //   return new mapboxgl.Marker(elem, {
    //     offset: [spiderParam.x, spiderParam.y]
    //   })
    //     .setLngLat(latLng)
    //     .addTo(map);
    // });
  }

  function unspiderfy() {
    util.each(previousMarkers, function(oldMarker) {
      oldMarker.remove();
    });
    previousMarkers = [];
  }

  function generateSpiderParams(count) {
    if (count >= options.circleSpiralSwitchover) {
      return generateSpiralParams(count);
    } else {
      return generateCircleParams(count);
    }
  }

  function generateSpiralParams(count, centerPt) {
    var legLength = options.spiralLengthStart,
      angle = 0;
    return util.mapTimes(count, function(index) {
      var pt;
      angle =
        angle + (options.spiralFootSeparation / legLength + index * 0.0005);
      pt = {
        x: legLength * Math.cos(angle),
        y: legLength * Math.sin(angle),
        angle: angle,
        legLength: legLength,
        index: index
      };
      legLength = legLength + (twoPi * options.spiralLengthFactor) / angle;
      return pt;
    });
  }

  function generateCircleParams(count, centerPt) {
    var circumference = options.circleFootSeparation * (2 + count),
      legLength = circumference / twoPi, // = radius from circumference
      angleStep = twoPi / count;

    return util.mapTimes(count, function(index) {
      var angle = index * angleStep;
      return {
        x: legLength * Math.cos(angle),
        y: legLength * Math.sin(angle),
        angle: angle,
        legLength: legLength,
        index: index
      };
    });
  }

  // Utility
  function eachFn(array, iterator) {
    var i = 0;
    if (!array || !array.length) {
      return [];
    }
    for (i = 0; i < array.length; i++) {
      iterator(array[i], i);
    }
  }

  function eachTimesFn(count, iterator) {
    if (!count) {
      return [];
    }
    for (let i = 0; i < count; i++) {
      iterator(i);
    }
  }

  function mapFn(array, iterator) {
    var result = [];
    eachFn(array, function(item, i) {
      result.push(iterator(item, i));
    });
    return result;
  }

  function mapTimesFn(count, iterator) {
    var result = [];
    eachTimesFn(count, function(i) {
      result.push(iterator(i));
    });
    return result;
  }
}
