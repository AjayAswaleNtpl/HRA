/*
 1.This controller is used to show payslip and tax slip.
 2.Payslip and tax slip are downloaded and opened.
 */


mainModule.controller("faceRecogCtrl", function ($scope,  $ionicModal, $ionicLoading,
$timeout) {
	
	const imageUpload = document.getElementById('imageUpload')
	
  $ionicLoading.show()
Promise.all([
  
  faceapi.nets.faceRecognitionNet.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('https://gitcdn.xyz/repo/justadudewhohacks/face-api.js/master/weights/')
]).then(start)

async function start() {
  
  $ionicLoading.hide()
  alert(baseURL)
	
  const container = document.createElement('div')
  container.style.position = 'relative'
  document.body.append(container)
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  
  document.body.append('Loaded')
  
  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = await faceapi.bufferToImage(imageUpload.files[0])
    container.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    container.append(canvas)
    const displaySize = { width: image.width, height: image.height }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
      drawBox.draw(canvas)
    })
  })
}

function loadLabeledImages() {
  //const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  const labels = ['Black Widow', 'Captain America', 'Tony Stark']

  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
        //const img = await faceapi.fetchImage(baseURL + `/labeled_images/${label}/${i}.jpg`)
        //if (img)  alert("yes image   ${label}")
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        if (detections)
        descriptions.push(detections.descriptor)
        else
        alert("detections is null")
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

	
});

