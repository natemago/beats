package org.natemago.beats.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.natemago.beats.server.data.Message;
import org.natemago.beats.server.data.SensorData;

public class DispatcherServlet extends HttpServlet{
	
	/**
	 * 
	 */
	
	private Map<String, Message> channels = new HashMap<String, Message>();
	
	private static final long serialVersionUID = -2077431212847632912L;
	
	private int seq = 0;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String path = getRequestPath(req);
		if(path.startsWith("/poll/")){
			poll(req, resp);
		}else if(path.startsWith("/sub/")){
			processNewChannel(req, resp);
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		publishMessage(req, resp);
	}
	
	private void processNewChannel(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		resp.getWriter().write( String.format("{\"channelId\":\"%s\", \"info\":{}}", getChannelID()) );
	}
	
	private void publishMessage(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		Message m = new Message();
		BufferedReader br = new BufferedReader(new InputStreamReader(req.getInputStream()));
		String line = br.readLine();
		m.setChannel(line.trim());
		m.setTimestamp(System.currentTimeMillis());
		List<SensorData> dataLst = new LinkedList<SensorData>();
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
			dataLst.add(sd);
		}
		m.setData(dataLst.toArray(new SensorData[]{}));
		synchronized (this) {
			channels.put(m.getChannel(), m);
		}
		System.out.println("Received: " + m.toJSON());
	}
	
	private void poll(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
		String path = getRequestPath(req);
		if(path.startsWith("/poll/")){
			String cid = path.substring("/poll/".length());
			Message m = null;
			synchronized (this) {
				m = channels.get(cid);
				channels.put(cid, null);
			}
			if(m != null){
				resp.getWriter().write(  m.toJSON() );
			}else{
				try {
					Thread.sleep(50);
				} catch (InterruptedException e) {
				}
				resp.getWriter().write("{}");
			}
		}else{
			throw new ServletException("Invalid poll path");
		}
	}
	
	private synchronized String getChannelID(){
		return "chanel-"+seq++;
	}
	
	public static void main(String[] args) {
		float [] a = new float []{1.3f,2.6f,7.9f};
		System.out.println(Arrays.toString(a));
	}
	
	private String getRequestPath(HttpServletRequest request){
		String ctxPath = request.getContextPath();
		return request.getRequestURI().substring(ctxPath.length());
	}
}
