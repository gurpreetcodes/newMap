"use strict";

import powerbi from "powerbi-visuals-api";
import "../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as atlas from 'azure-maps-control';
import "@babylonjs/loaders/glTF";
import * as BABYLON from 'babylonjs';

export class Visual implements IVisual {
    private map: atlas.Map;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private canvas: HTMLCanvasElement;

    constructor(options: VisualConstructorOptions) {
        this.canvas = document.createElement('canvas');
        options.element.appendChild(this.canvas);

        this.initMap(options.element);
        this.initBabylon();
        this.loadModel();
    }

    private initMap(element: HTMLElement) {
        this.map = new atlas.Map(element, {
            center: [-122.33, 47.6],
            zoom: 10,
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: 'F2zJZJtpSrvWtseYKIwpjCt6LcZ5BFp0XpR8a1wF5aYz9HZxEpBfJQQJ99AIACYeBjFqDT5DAAAgAZMPz8fJ' // Add your subscription key
            }
        });

        this.map.events.add('ready', () => {
            console.log('Map is ready');
        });
    }

    private initBabylon() {
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        
        // Set up camera
        const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), this.scene);
        camera.attachControl(this.canvas, true);
        
        // Set up light
        new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        
        // Render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    private loadModel() {
        const modelUrl = 'http://localhost:8000/'; // Point to your GLTF file

        BABYLON.SceneLoader.Append(modelUrl, '34M_17.gltf', this.scene, (scene) => {
            console.log('Model loaded successfully');
            const model = scene.meshes[0];

            // Position the model
            model.position = new BABYLON.Vector3(0, 0, 0);
            model.scaling = new BABYLON.Vector3(1, 1, 1);

            // Update model position based on map coordinates
            this.updateModelPosition();
        }, null, (scene, message) => {
            console.error('Model loading error:', message);
        });
    }

    private updateModelPosition() {
        const coords = this.map.getCamera().center; // Get the map center coordinates
        const position = this.convertCoordinatesToBabylon(coords[0], coords[1]);

        // Update the model's position
        if (this.scene.meshes.length > 0) {
            const model = this.scene.meshes[0];
            model.position.x = position.x;
            model.position.z = position.z; // Y-axis in Babylon is Z-axis in 3D
            model.position.y = position.y; // Adjust height if necessary
        }

        // Call this function to keep updating the model's position
        requestAnimationFrame(() => this.updateModelPosition());
    }

    private convertCoordinatesToBabylon(longitude: number, latitude: number) {
        // Convert geographic coordinates to Babylon's 3D coordinates.
        // You might need to adjust these calculations based on your map's scaling and projection.

        // For example, a simple conversion could be:
        const x = longitude; // or some scaling factor
        const z = latitude;  // or some scaling factor
        const y = 0; // Adjust height here if needed

        return new BABYLON.Vector3(x, y, z);
    }

    public update(options: VisualUpdateOptions) {
        this.canvas.width = options.viewport.width;
        this.canvas.height = options.viewport.height;
        
        this.engine.resize();
    }
}
