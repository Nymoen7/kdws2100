import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import VectorLayer from "ol/layer/Vector";
import "ol/ol.css";
import { Fill, Stroke, Style } from "ol/style";

useGeographic();

export function Application() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const map = useRef<Map | null>(null);
    const [checked, setChecked] = useState(false);

    // Base tile layer
    const baseLayer = useRef(new TileLayer({ source: new OSM() }));

    // Sivilforsvar layer (initialized inside effect)
    const sivForsvarsLayer = useRef<VectorLayer | null>(null);

    useEffect(() => {
        if (!map.current) {
            map.current = new Map({
                view: new View({ center: [10.8, 59.9], zoom: 13 }),
                layers: [baseLayer.current],
            });

            map.current.setTarget(mapRef.current!);
        }
    }, []);

    useEffect(() => {
        if (!map.current) return;

        if (checked && !sivForsvarsLayer.current) {
            const source = new VectorSource({
                url: "/kdws2100/geojson/Sivilforsvarsdistrikter.geojson",
                format: new GeoJSON(),
            });

            sivForsvarsLayer.current = new VectorLayer({
                source,
                style: new Style({
                    stroke: new Stroke({ color: "blue", width: 2 }),
                    fill: new Fill({ color: "green" }),
                }),
            });

            map.current.addLayer(sivForsvarsLayer.current);
        } else if (!checked && sivForsvarsLayer.current) {
            map.current.removeLayer(sivForsvarsLayer.current);
            sivForsvarsLayer.current = null;
        }
    }, [checked]);

    return (
        <>
            <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
            <div ref={mapRef} style={{ width: "100%", height: "1000px" }}></div>
        </>
    );
}
