import type types = require("./types");
import inputData from "./input3.json" with { type: "json" };
import { TechnicianResource, EquipmentResource } from "./classes.js";
import { minutesToTime, timeToMinutes } from "./functions.js";

const priorityWeight: Record<string, number> = {
  STAT: 1,
  URGENT: 2,
  ROUTINE: 3,
};

function planifyLab(data: {
  samples: types.Sample[];
  technicians: types.Technician[];
  equipment: types.Equipment[];
}): types.PlanningResult {
  const schedule: types.ScheduleEntry[] = [];

  let totalWorkTime = 0;

  const technicians = data.technicians.map((t) => new TechnicianResource(t));
  const equipment = data.equipment.map((e) => new EquipmentResource(e));

  const priorityComparedSamples = data.samples.sort((a, b) => {
    const priorityDiff =
      Number(priorityWeight[a.priority]) - Number(priorityWeight[b.priority]);
    if (priorityDiff !== 0) return priorityDiff;
    return a.arrivalTime.localeCompare(b.arrivalTime);
  });

  priorityComparedSamples.forEach((sample) => {
    const arrival = timeToMinutes(sample.arrivalTime);

    let compatibleEquips = equipment.filter(
      (equipment) => equipment.data.type === sample.type,
    );
    let compatibleTechs = technicians.filter(
      (tech) =>
        tech.data.speciality === sample.type ||
        tech.data.speciality === "GENERAL",
    );

    if (compatibleTechs.length > 0 && compatibleEquips.length > 0) {
      let bestStart = Infinity;
      let selectedTech: TechnicianResource | null = null;
      let selectedEquip: EquipmentResource | null = null;

      for (const t of compatibleTechs) {
        for (const e of compatibleEquips) {
          const possibleStart = Math.max(
            arrival,
            t.nextAvailableTime,
            e.nextAvailableTime,
          );

          if (possibleStart < bestStart) {
            bestStart = possibleStart;
            selectedTech = t;
            selectedEquip = e;
          }
        }
      }

      if (selectedTech && selectedEquip) {
        const end = bestStart + sample.analysisTime;
        totalWorkTime += sample.analysisTime;
        schedule.push({
          sampleId: sample.id,
          technicianId: selectedTech.data.id,
          equipmentId: selectedEquip.data.id,
          startTime: minutesToTime(bestStart),
          endTime: minutesToTime(end),
          priority: sample.priority,
        });

        selectedTech.nextAvailableTime = end;
        selectedEquip.nextAvailableTime = end;
      }
    }
  });

  // metrics

  const startTimes = schedule.map((s) => timeToMinutes(s.startTime));
  const endTimes = schedule.map((s) => timeToMinutes(s.endTime));
  const totalSpan = Math.max(...endTimes) - Math.min(...startTimes);
  const efficiency = totalSpan > 0 ? (totalWorkTime / totalSpan) * 100 : 0;

  return {
    schedule,
    metrics: { totalTime: totalSpan, efficiency, conflicts: 0 },
  };
}

console.log(
  "Planning result:",
  planifyLab(inputData as unknown as types.LabData),
);
