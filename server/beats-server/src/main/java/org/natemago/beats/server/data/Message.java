package org.natemago.beats.server.data;

public class Message {
	private String channel;
	private SensorData [] data;
	private long timestamp;
	
	
	
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}
	public String getChannel() {
		return channel;
	}
	public void setChannel(String channel) {
		this.channel = channel;
	}
	public SensorData[] getData() {
		return data;
	}
	public void setData(SensorData[] data) {
		this.data = data;
	}
	
	public String toJSON(){
		String dataStr = "[";
		if(data != null){
			for(int i = 0; i < data.length; i++){
				dataStr += data[i].toJSON();
				if(i < (data.length-1)){
					dataStr += ",";
				}
			}
		}
		dataStr += "]";
		String json = String.format("{\"channel\":\"%s\",\"timestamp\":%d,\"data\":%s}", channel,timestamp, dataStr);
		return json;
	}
	
}
