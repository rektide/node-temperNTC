var HID = require('HID');
var readExternalCommand=[0x01, 0x80, 0x33, 0x01, 0x00, 0x00, 0x00, 0x00];

exports.getDevices=function() {
 var devices=HID.devices();
 var list=[];
 devices.forEach(function(item) {
   if(item.product==="TEMPerNTC1.1" && 
      item.vendorId===3141 && 
      item.interface===1){  list.push(item.path);
  }
 });
 return list;
}

exports.readTemperature=function(path, callback){
 var device = new HID.HID(path);
 device.write(readExternalCommand);
 device.read(function(err,response){
   console.log([err,response]);
   if(err) {
    callback.call(this,err,null); 
   } else {
    callback.call(this,null, [response[4]+response[5]/100,response[6]+response[7]/100]);
   }
 });
}

if(require.main == module){
  var vals,
    devices=exports.getDevices(),
    handles,
    ref,
    probeDevices,
    temperntc= require.main.exports


  function oneHandle(err,val){
    if(vals != val){
      process.write(val)
      process.write(",\n")
      vals= val
    }
    probeDevices()
  }

  function manyHandle(err,val){
    var n= Number(this)
    if(vals[n] != val){
      process.write("["+n+","+val+"]")
      vals[n]= val
    }
    if(!--ref)
      probeDevices()
  }

  if(devices.length> 1){
    handles= []
    probeDevices= function(){
      for(var i in devices){
        handles[i]= handleMany.bind(i)
        temperntc.readTemperature(devices[i],handles[i])
      }
    }
  }else{
    probeDevices= function(){
      temperntc.readTemperature(devices[i],oneHandle()
    }
  }
  var rawProbe= probeDevices
  probeDevices= function(){
    setTimeout(rawProbe,1000)
  }
  
  process.stdout.write("[")
    probeDevices()
  }
  setInterval(function(){
    for(var i in 
	thermometers.readTemperature(
  },1000)
  process.on("exit",function(){
    process.stdout.write("]")
  })
}

