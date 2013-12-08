(function (window, document, THREE) {
	"use strict";

	var camera, scene, renderer;
	var imageLoader, objLoader;
	var objects = {};

	init();

	addCube();
	addSword();

	addPointLight();
	addAmbientLight();

	animate();

	function init () {
		var manager;

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
		renderer = new THREE.WebGLRenderer();

		camera.position.z = 1000;
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xaaaaaa, 1);

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
		var material = new THREE.MeshLambertMaterial({ color: 0xffffff});

		objects.cube = new THREE.Mesh(geometry, material);

		objects.cube.position.x = 0;
		objects.cube.position.y = 0;
		objects.cube.position.z = 0;

		scene.add(objects.cube);
	}

	function addSword () {
		var diffuseTexture = new THREE.Texture();
		var specularTexture = new THREE.Texture();
		var normalTexture = new THREE.Texture();
		var lightTexture = new THREE.Texture();

		imageLoader.load('textures/skywardSwordDiffuse.png', function (image) {
			diffuseTexture.image = image;
			diffuseTexture.needsUpdate = true;
		});
		imageLoader.load('textures/skywardSwordSpecular.png', function (image) {
			specularTexture.image = image;
			specularTexture.needsUpdate = true;
		});
		imageLoader.load('textures/skywardSwordNormal.png', function (image) {
			normalTexture.image = image;
			normalTexture.needsUpdate = true;
		});
		imageLoader.load('textures/skywardSwordEmit.png', function (image) {
			lightTexture.image = image;
			lightTexture.needsUpdate = true;
		});

		objLoader.load('3d-models/sword.obj', function (object) {
			/**
			 * If we had to duplicate the object to add multiple materials, this
			 * is how it would be done.
			 *
			 * object = THREE.SceneUtils.createMultiMaterialObject(
			 * 	object.children[0].geometry, [
			 * 		new THREE.MeshLambertMaterial({
			 * 			map: texture,
			 * 			transparent: true
			 * 		}),
			 * 		new THREE.MeshPhongMaterial({color: 0xceeeff})
			 * 	]
			 * );
			 */

			object.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial({
						map: diffuseTexture,
						specularMap: specularTexture,
						// lightMap: lightTexture, doesn't seem to work
						normalMap: normalTexture,
						transparent: true
					})
				}
			});

			object.position.x = 0;
			object.position.y = 0;
			object.position.z = 0;

			object.rotation.y += 10.3;

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
		objects.pointLight = new THREE.PointLight(0xaaaaaa);

		objects.pointLight.position.x = 10;
		objects.pointLight.position.y = -100;
		objects.pointLight.position.z = 130;

		scene.add(objects.pointLight);
	}

	function addAmbientLight () {
		objects.ambientLight = new THREE.AmbientLight(0xaaaaaa);

		scene.add(objects.ambientLight);
	}

	function render () {
		if (objects.sword) {
			objects.sword.rotation.y += 0.07;
			camera.lookAt(objects.sword.position);
		}

		renderer.render(scene, camera);
	}

	function animate () {
		requestAnimationFrame(animate);
		render();
	}

}(window, document, window.THREE));
