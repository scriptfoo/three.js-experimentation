(function (window, document, THREE) {
	"use strict";

	var camera, scene, renderer;
	var imageLoader, objLoader;
	var objects = {};

	init();

	addCube();
	addSword();

	addPointLight();

	window.setTimeout(animate, 2000);

	function init () {
		var manager;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
		renderer = new THREE.WebGLRenderer();

		camera.position.z = 1000;
		renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(renderer.domElement);

		manager = new THREE.LoadingManager();
		manager.onProgress = function (item, loaded, total) {
			console.log(item, loaded, total);
		};

		imageLoader = new THREE.ImageLoader(manager);
		objLoader = new THREE.OBJLoader(manager);
	}

	function addCube () {
		var geometry = new THREE.CubeGeometry(1,1,1);
		var material = new THREE.MeshLambertMaterial({ color: 0x00ff00});

		objects.cube = new THREE.Mesh(geometry, material);

		objects.cube.position.x = 0;
		objects.cube.position.y = 0;
		objects.cube.position.z = 0;

		scene.add(objects.cube);
	}

	function addSword () {
		var texture = new THREE.Texture();

		imageLoader.load('textures/skywardSwordDiffuse.png', function (image) {
			texture.image = image;
			texture.needsUpdate = true;
		});

		objLoader.load('3d-models/sword.obj', function (object) {
			console.log(object);
			object.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material.map = texture;
					child.material.color = new THREE.Color(0xffffff);
				}
			});

			object.position.x = 0;
			object.position.y = 0;
			object.position.z = 0;

			object.scale = {
				x: 0.5,
				y: 0.5,
				z: 0.5
			};

			objects.sword = object;
			scene.add(objects.sword);
		});
	}

	function addPointLight () {
		objects.pointLight = new THREE.PointLight(0xFFFFFF);

		objects.pointLight.position.x = 10;
		objects.pointLight.position.y = 50;
		objects.pointLight.position.z = 130;

		scene.add(objects.pointLight);
	}

	function render () {
		//objects.sword.rotation.x += 0.04;
		objects.sword.rotation.y += 0.2;

		camera.lookAt(objects.sword.position);

		renderer.render(scene, camera);
	}

	function animate () {
		requestAnimationFrame(animate);
		render();
	}

}(window, document, window.THREE));
