import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import { GUI } from 'dat.gui'
import { gsap, Power4 } from "gsap";

import vertex from "./shader/output.glsl?raw";
import fragment from "./shader/fragment.glsl?raw";

class App {
  /**
   * レンダー
   */
  static get RENDERER_SETTING() {
    return {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  /**
   * マテリアル
   */
  static get MATERIAL_SETTING() {
    return {
      color: 0xffffff,
    };
  }
  /**
   * カメラ
   */
  static get CAMERA_PARAM() {
    return {
      fovy: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 200000.0,
      x: 0.0,
      y: 0.0,
      z: 3.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }
    /**
   * GUI
   */
  static get GUI_PARAM() {
    return {
      color_r : 0.1,
      color_g : 0.1,
      color_b : 0.1,
    }
  }

  /**
   * @constructor
   */
  constructor() {
    this.renderer;
    this.scene;
    this.camera;
    this.geometory;
    this.material;
    this.mesh;
    this.array = [];
    this.group;

    this.ambientLight;
    this.directionalLight;

    this.loader;
    this.texture;

    this.raycaster;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.render = this.render.bind(this);
  }

  _setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha:true});
    this.renderer.setClearColor(new THREE.Color(App.RENDERER_SETTING.clearColor));
    this.renderer.setSize(App.RENDERER_SETTING.width, App.RENDERER_SETTING.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const canvas = document.querySelector("#webgl");
    canvas.appendChild(this.renderer.domElement);
  }

  _setScene() {
    this.scene = new THREE.Scene();
  }

  _setCamera() {
    this.camera = new THREE.PerspectiveCamera(App.CAMERA_PARAM.fovy, App.CAMERA_PARAM.aspect, App.CAMERA_PARAM.near, App.CAMERA_PARAM.far);
    this.camera.position.set(App.CAMERA_PARAM.x, App.CAMERA_PARAM.y, App.CAMERA_PARAM.z);
    this.camera.lookAt(App.CAMERA_PARAM.lookAt);
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, document.body);

  }


  _setMesh() {

    const particleCount = 400000;
    const positions = new Float32Array(particleCount * 3);
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        uColorR:{value:0.1},
        uColorG:{value:0.1},
        uColorB:{value:0.2},
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      blending:THREE.AdditiveBlending
    });

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);


  }

  _guiSet() {

    this.options = {
      color: {
        color_r:0.2,
        color_g:0.3,
        color_b:0.3,
      }
    }

    this.gui = new GUI({ width: 300 });
    this.gui.open();
    let color = this.gui.addFolder('Color');
    color.add(this.options.color,'color_r',0.1,1.0).listen();
    color.add(this.options.color,'color_g',0.1,1.0).listen();
    color.add(this.options.color,'color_b',0.1,1.0).listen();

  }


  init() {
    this._setRenderer();
    this._setScene();
    this._setCamera();
    this._setMesh();
    this._guiSet();
  }

  render() {
    requestAnimationFrame(this.render);
    this.controls.update();

    this.mesh.material.uniforms.uTime.value += 0.01;
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
    this.mesh.material.uniforms.uColorR.value = this.options.color.color_r;
    this.mesh.material.uniforms.uColorG.value = this.options.color.color_g;
    this.mesh.material.uniforms.uColorB.value = this.options.color.color_b;

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
  app.render();
  window.addEventListener("resize", () => {
    app.onResize();
  });
});

export {};
