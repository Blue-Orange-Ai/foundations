import {BlueOrangeMapGeoPoint} from "@blue-orange-ai/primitives-map";

import {MapMarkerKind} from "../../components/map-markers/types";

/**
 * A tiny planar movement model, enough to walk vehicles around a route at a
 * plausible speed and work out which way they are pointing. Distances are in
 * metres, using an equirectangular approximation — over a few kilometres of
 * central London the error is far smaller than the markers themselves.
 */

const METRES_PER_DEGREE_LATITUDE = 111320;

const toRadians = (degrees: number): number => degrees * Math.PI / 180;

/** East/north offset, in metres, from `from` to `to`. */
const offsetMetres = (from: BlueOrangeMapGeoPoint, to: BlueOrangeMapGeoPoint): {east: number, north: number} => {
	const midLatitude = toRadians((from.lat + to.lat) / 2);
	return {
		east: (to.lng - from.lng) * METRES_PER_DEGREE_LATITUDE * Math.cos(midLatitude),
		north: (to.lat - from.lat) * METRES_PER_DEGREE_LATITUDE
	};
}

const distanceMetres = (from: BlueOrangeMapGeoPoint, to: BlueOrangeMapGeoPoint): number => {
	const {east, north} = offsetMetres(from, to);
	return Math.sqrt(east * east + north * north);
}

/** Bearing in degrees clockwise from north, which is what the markers rotate by. */
const bearingDegrees = (from: BlueOrangeMapGeoPoint, to: BlueOrangeMapGeoPoint): number => {
	const {east, north} = offsetMetres(from, to);
	return (Math.atan2(east, north) * 180 / Math.PI + 360) % 360;
}

export interface RoutePosition {
	latlng: BlueOrangeMapGeoPoint,
	heading: number
}

/**
 * A closed route, pre-measured so a vehicle can be placed at any distance along
 * it without walking the whole polyline every tick.
 */
export class Route {

	readonly points: Array<BlueOrangeMapGeoPoint>;

	/** Cumulative distance to the start of each leg, plus the total at the end. */
	private readonly cumulative: Array<number>;

	constructor(points: Array<BlueOrangeMapGeoPoint>) {
		// The route closes back on itself so vehicles can lap it forever.
		this.points = points.concat([points[0]]);
		this.cumulative = [0];
		for (let i = 1; i < this.points.length; i++) {
			this.cumulative.push(this.cumulative[i - 1] + distanceMetres(this.points[i - 1], this.points[i]));
		}
	}

	get length(): number {
		return this.cumulative[this.cumulative.length - 1];
	}

	positionAt(distance: number): RoutePosition {
		const along = ((distance % this.length) + this.length) % this.length;
		let leg = 1;
		while (leg < this.cumulative.length - 1 && this.cumulative[leg] < along) {
			leg++;
		}
		const from = this.points[leg - 1];
		const to = this.points[leg];
		const legLength = this.cumulative[leg] - this.cumulative[leg - 1];
		const fraction = legLength === 0 ? 0 : (along - this.cumulative[leg - 1]) / legLength;
		return {
			latlng: {
				lat: from.lat + (to.lat - from.lat) * fraction,
				lng: from.lng + (to.lng - from.lng) * fraction
			},
			heading: bearingDegrees(from, to)
		};
	}
}

export type VehicleMarkerStyle = "fixed" | "floating" | "puck";

export interface VehicleDefinition {
	id: string,
	name: string,
	detail: string,
	/** Remixicon class for the vehicle. */
	icon: string,
	kind: MapMarkerKind,
	trackColour: string,
	markerStyle: VehicleMarkerStyle,
	/** Cruising speed in km/h. */
	speedKph: number,
	/** Where on the route the vehicle starts, as a fraction of its length. */
	start: number,
	route: Route
}

export interface VehicleState {
	distance: number,
	latlng: BlueOrangeMapGeoPoint,
	heading: number,
	/** Current speed in km/h — it breathes around the cruising speed. */
	speedKph: number
}

const CITY_LOOP = new Route([
	{lat: 51.5155, lng: -0.0922}, {lat: 51.5142, lng: -0.0862}, {lat: 51.5118, lng: -0.0780},
	{lat: 51.5074, lng: -0.0787}, {lat: 51.5045, lng: -0.0865}, {lat: 51.5033, lng: -0.0965},
	{lat: 51.5064, lng: -0.1044}, {lat: 51.5109, lng: -0.1035}, {lat: 51.5138, lng: -0.0983}
]);

const WEST_END_LOOP = new Route([
	{lat: 51.5074, lng: -0.1278}, {lat: 51.5100, lng: -0.1340}, {lat: 51.5128, lng: -0.1420},
	{lat: 51.5152, lng: -0.1418}, {lat: 51.5164, lng: -0.1310}, {lat: 51.5152, lng: -0.1230},
	{lat: 51.5117, lng: -0.1224}
]);

const RIVER_RUN = new Route([
	{lat: 51.5008, lng: -0.1246}, {lat: 51.5045, lng: -0.1200}, {lat: 51.5085, lng: -0.1130},
	{lat: 51.5110, lng: -0.1050}, {lat: 51.5104, lng: -0.0983}, {lat: 51.5064, lng: -0.0942},
	{lat: 51.5040, lng: -0.1040}, {lat: 51.5030, lng: -0.1150}, {lat: 51.4985, lng: -0.1210}
]);

const PARK_PATROL = new Route([
	{lat: 51.5027, lng: -0.1527}, {lat: 51.5031, lng: -0.1700}, {lat: 51.4975, lng: -0.1800},
	{lat: 51.4995, lng: -0.1900}, {lat: 51.5062, lng: -0.1889}, {lat: 51.5090, lng: -0.1750},
	{lat: 51.5085, lng: -0.1590}
]);

export const VEHICLES: Array<VehicleDefinition> = [
	{
		id: "courier-van", name: "Courier van 04", detail: "City parcel loop",
		icon: "ri-truck-fill", kind: "default", trackColour: "#0f172a",
		markerStyle: "fixed", speedKph: 34, start: 0, route: CITY_LOOP
	},
	{
		id: "cycle-courier", name: "Cycle courier 11", detail: "West End",
		icon: "ri-bike-fill", kind: "accent", trackColour: "#276ef1",
		markerStyle: "fixed", speedKph: 22, start: 0.35, route: WEST_END_LOOP
	},
	{
		id: "response-unit", name: "Response unit 02", detail: "Riverside",
		icon: "ri-alarm-warning-fill", kind: "negative", trackColour: "#e11900",
		markerStyle: "floating", speedKph: 48, start: 0.6, route: RIVER_RUN
	},
	{
		id: "field-team", name: "Field team A", detail: "Park patrol",
		icon: "ri-user-location-fill", kind: "accent", trackColour: "#16a34a",
		markerStyle: "puck", speedKph: 14, start: 0.15, route: PARK_PATROL
	}
];

export const initialVehicleState = (vehicle: VehicleDefinition): VehicleState => {
	const distance = vehicle.route.length * vehicle.start;
	const position = vehicle.route.positionAt(distance);
	return {
		distance: distance,
		latlng: position.latlng,
		heading: position.heading,
		speedKph: vehicle.speedKph
	};
}

/**
 * Moves a vehicle on by `elapsedSeconds`. The speed wanders a little around the
 * cruising speed so the readouts and the trail spacing do not look metronomic.
 */
export const advanceVehicle = (
	vehicle: VehicleDefinition,
	state: VehicleState,
	elapsedSeconds: number): VehicleState => {

	const wander = 0.75 + 0.5 * Math.abs(Math.sin(state.distance / 260));
	const speedKph = vehicle.speedKph * wander;
	const distance = state.distance + (speedKph / 3.6) * elapsedSeconds;
	const position = vehicle.route.positionAt(distance);

	return {
		distance: distance,
		latlng: position.latlng,
		heading: position.heading,
		speedKph: speedKph
	};
}
