const Device = require("../model/Device");

const ADD_NEW_DEVICE = "new-device";
const GET_ALL_DEVICE = "get-devices";
const DELETE_DEVICE = "delete-device";
const UPDATE_DEVICE = "update-device";

module.exports = {
  ADD_NEW_DEVICE,
  GET_ALL_DEVICE,
  DELETE_DEVICE,
  UPDATE_DEVICE,
};

module.exports.onAddNewDevice = async (e, args) => {
  try {
    let device = new Device(args);
    const deviceSaved = await device.save();
    e.reply("new-device-saved", JSON.stringify(deviceSaved));
  } catch (error) {
    e.reply("error", error.message);
  }
};

module.exports.onGetDevices = async (e, args) => {
  try {
    const devices = await Device.find();
    e.reply("get-devices", JSON.stringify(devices));
  } catch (error) {
    e.reply("error", error.message);
  }
};

module.exports.onDeleteDevices = async (e, _id) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(_id);
    e.reply("delete-device-success", JSON.stringify(deletedDevice));
  } catch (error) {
    console.log(error);
    e.reply("error", error.message);
  }
};

module.exports.onUpdateDevices = async (e, args) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      args.idDeviceToUpdate,
      { name: args.name },
      { new: true }
    );
    e.reply("update-device-success", JSON.stringify(updatedDevice));
  } catch (error) {
    console.log(error);
    e.reply("error", error.message);
  }
};
