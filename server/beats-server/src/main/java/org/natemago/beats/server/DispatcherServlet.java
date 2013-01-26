package org.natemago.beats.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.natemago.beats.server.data.Message;
import org.natemago.beats.server.data.SensorData;

class DispatcherServlet extends HttpServlet{
	
	/**
	 * 
	 */
	
	private Map<String, Message> channels = new HashMap<String, Message>();
	
	private static final long serialVersionUID = -2077431212847632912L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
	}
	
	private void processNewChannel(HttpServletRequest req, HttpServletResponse resp){
		
	}
	
	private void publishMessage(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		Message m = new Message();
		BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
		String line = br.readLine();
		m.setChannel(line.trim());
		m.setTimestamp(System.currentTimeMillis());
		while((line = br.readLine()) != null){
			SensorData sd = new SensorData();
			String [] vals = line.trim().split(",");
			sd.setSensorType(vals[0]);
			sd.setTimestamp(Long.parseLong(vals[1]));
			float [] values = new float [vals.length - 2];
			for(int i = 2; i < vals.length; i++){
				values[i-2] = Float.parseFloat(vals[i]);
			}
			sd.setValues(values);
		}
		synchronized (this) {
			channels.put(m.getChannel(), m);
		}
	}
	
	private void poll(HttpServletRequest req, HttpServletResponse resp){
		
	}
}
