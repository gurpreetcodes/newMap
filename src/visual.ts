"use strict";

import powerbi from "powerbi-visuals-api";
import "../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import * as atlas from 'azure-maps-control';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Visual implements IVisual {
    private target: HTMLElement;
    private map: atlas.Map;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;

        console.log("Initializing Azure Map...");

        this.map = new atlas.Map(this.target, {
            center: [-122.4194, 37.7749],
            zoom: 10,
            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: 'F2zJZJtpSrvWtseYKIwpjCt6LcZ5BFp0XpR8a1wF5aYz9HZxEpBfJQQJ99AIACYeBjFqDT5DAAAgAZMPz8fJ' 
            },
            style: 'road' 
        });

       
        this.map.events.add('error', (e) => {
            console.error('Error loading Azure Map:', e);
        });

        this.map.events.add('ready', () => {
            console.log("Azure Map is ready.");
          
            const data = [
                { latitude: 37.7749, longitude: -122.4194, value: 100 },
                { latitude: 34.0522, longitude: -118.2437, value: 200 }
            ];

            data.forEach(d => {
                const marker = new atlas.HtmlMarker({
                    position: [d.longitude, d.latitude],
                    text: d.value.toString()
                });
                this.map.markers.add(marker);
            });

           
            this.initThreeJS();
        });
    }

    private initThreeJS() {
        console.log("Initializing Three.js...");

        const scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.target.clientWidth / this.target.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.target.clientWidth, this.target.clientHeight);
        this.target.appendChild(this.renderer.domElement);

       
        const loader = new GLTFLoader();
        loader.load('./models/scene.gltf', (gltf) => {
            scene.add(gltf.scene);
            this.camera.position.z = 5;

            const animate = () => {
                requestAnimationFrame(animate);
                gltf.scene.rotation.x += 0.01;
                gltf.scene.rotation.y += 0.01;
                this.renderer.render(scene, this.camera);
            };
            animate();
        }, undefined, (error) => {
            console.error('An error occurred while loading the 3D model:', error);
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = this.target.clientWidth / this.target.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.target.clientWidth, this.target.clientHeight);
        });
    }

    public update(options: VisualUpdateOptions): void {
        console.log("Update called with options:", options);
    }
}
