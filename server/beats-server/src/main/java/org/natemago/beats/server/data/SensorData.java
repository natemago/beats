package org.natemago.beats.server.data;

import java.util.Arrays;

public class SensorData {
	private String sensorType;
	private float [] values;
	private long timestamp;
	
	
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
	public String getSensorType() {
		return sensorType;
	}
	public void setSensorType(String sensorType) {
		this.sensorType = sensorType;
	}
	public float[] getValues() {
		return values;
	}
	public void setValues(float[] values) {
		this.values = values;
	}
	
	public String toJSON(){
		String json = String.format("{\"timestamp\":%d,\"type\":\"%s\",\"values\":%s}", 
					timestamp,sensorType, Arrays.toString(values));
		return json;
	}
}
