import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";

useGeographic();

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [sivForsvarsChecked, setSivForsvarsChecked] = useState(false);
  const [tilfluktsromChecked, setTilfluktsromChecked] = useState(false);
  // Base tile layer
  const baseLayer = useRef(new TileLayer({ source: new OSM() }));

  // Sivilforsvar layer (initialized inside effect)
  const sivForsvarsLayer = useRef<VectorLayer | null>(null);

  const tilfluktsromLayer = useRef<VectorLayer | null>(null);

  function handlePointermove(e: MapBrowserEvent<MouseEvent>) {
    console.log(e.pixel);
    const features = map.current.getFeaturesAtPixel(e.pixel) as Feature[];
    console.log(features);
    for (const feature of features) {
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: "blue" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          }),
        }),
      );
    }
  }

  useEffect(() => {
    if (!map.current) {
      map.current = new Map({
        view: new View({ center: [10.8, 59.9], zoom: 13 }),
        layers: [baseLayer.current],
      });
      map.current.on("pointermove", handlePointermove);

      map.current.setTarget(mapRef.current!);
    }
  }, []);

  useEffect(() => {
    if (!map.current) return;

    if (sivForsvarsChecked && !sivForsvarsLayer.current) {
      const source = new VectorSource({
        url: "/kdws2100/geojson/Sivilforsvarsdistrikter.geojson",
        format: new GeoJSON(),
      });

      sivForsvarsLayer.current = new VectorLayer({
        source,
        style: new Style({
          stroke: new Stroke({ color: "blue", width: 2 }),
          //fill: new Fill({ color: "green" }),
        }),
      });

      map.current.addLayer(sivForsvarsLayer.current);
    } else if (!sivForsvarsChecked && sivForsvarsLayer.current) {
      map.current.removeLayer(sivForsvarsLayer.current);
      sivForsvarsLayer.current = null;
    }
  }, [sivForsvarsChecked]);

  useEffect(() => {
    if (!map.current) return;

    // Handle Tilfluktsrom layer
    if (tilfluktsromChecked && !tilfluktsromLayer.current) {
      const source = new VectorSource({
        url: "/kdws2100/geojson/OffentligeTilfluktsrom.geojson",
        format: new GeoJSON(),
      });

      tilfluktsromLayer.current = new VectorLayer({
        source,
        style: new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({ color: "red" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          }),
        }),
      });

      map.current.addLayer(tilfluktsromLayer.current);
    } else if (!tilfluktsromChecked && tilfluktsromLayer.current) {
      map.current.removeLayer(tilfluktsromLayer.current);
      tilfluktsromLayer.current = null;
    }
  }, [tilfluktsromChecked]);

  return (
    <>
      <div>
        <label htmlFor="sivforsvar">show siv forsvarsdistrikter</label>
        <input
          type="checkbox"
          checked={sivForsvarsChecked}
          onChange={() => setSivForsvarsChecked(!sivForsvarsChecked)}
        />
      </div>
      <div>
        <label htmlFor="tilfluktsrom">show tilfluktsrom</label>
        <input
          type="checkbox"
          checked={tilfluktsromChecked}
          onChange={() => setTilfluktsromChecked(!tilfluktsromChecked)}
        />
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "1000px" }}></div>
    </>
  );
}
