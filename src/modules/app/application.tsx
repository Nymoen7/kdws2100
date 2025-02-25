import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import {Fill, Stroke, Style} from "ol/style";






// By calling the "useGeographic" function in OpenLayers, we tell that we want coordinates to be in degrees
//  instead of meters, which is the default. Without this `center: [10.6, 59.9]` brings us to "null island"
useGeographic();

// Here we create a Map object. Make sure you `import { Map } from "ol"`. Otherwise, the standard Javascript
//  map data structure will be used/*

// A functional React component
export function Application() {
  const [layers, setLayers] = useState([new TileLayer({ source: new OSM() })]);

  const sivForsvarsSource = new VectorSource({
    url: "/kdws2100/geojson/Sivilforsvarsdistrikter.geojson",
    format: new GeoJSON(),
  });

  const sivForsvarsLayer = new VectorLayer({source: sivForsvarsSource})
  sivForsvarsLayer.setStyle(
      new Style({
        stroke: new Stroke({color: "blue", width: 2}),
        fill: new Fill({ color: "red"})
      })
  )

  console.log(sivForsvarsLayer)

  const map = new Map({
    view: new View({ center: [10.8, 59.9], zoom: 13 }),
    layers: layers,
  });

    const [checked, setChecked] = useState(false);


  // `useRef` bridges the gap between JavaScript functions that expect DOM objects and React components
  const mapRef = useRef<HTMLDivElement | null>(null);

  // When we display the page, we want the OpenLayers map object to target the DOM object refererred to by the
  // map React component
  useEffect(() => {
    map.setTarget(mapRef.current!);
  }, []);
  useEffect(() => {
    map.setLayers(layers)
  }, [layers]);
    useEffect(() => {
        console.log("checked ,", checked)
        if (checked){
            setLayers((old) => [...old, sivForsvarsLayer])
        }
    }, [checked]);

  // This is the location (in React) where we want the map to be displayed
  return <>
      <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
      <div ref={mapRef}></div>
  </>;
}
