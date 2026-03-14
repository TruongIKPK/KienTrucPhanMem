package org.logistics.factory;

import org.logistics.transport.Airplane;
import org.logistics.transport.ITransport;
import org.logistics.transport.Ship;
import org.logistics.transport.Truck;

public class TransportFactory {
    public static ITransport createTransport(String type) {
        if (type == null) {
            return null;
        }

        switch (type.toUpperCase()) {
            case "TRUCK":
                return new Truck();
            case "SHIP":
                return new Ship();
            case "AIRPLANE":
                return new Airplane();
            default:
                throw new IllegalArgumentException("Không hỗ trợ loại phương tiện: " + type);
        }
    }
}
