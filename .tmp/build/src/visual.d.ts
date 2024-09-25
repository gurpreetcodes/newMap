import powerbi from "powerbi-visuals-api";
import "../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import "@babylonjs/loaders/glTF";
export declare class Visual implements IVisual {
    private map;
    private engine;
    private scene;
    private canvas;
    constructor(options: VisualConstructorOptions);
    private initMap;
    private initBabylon;
    private loadModel;
    private updateModelPosition;
    private convertCoordinatesToBabylon;
    update(options: VisualUpdateOptions): void;
}
