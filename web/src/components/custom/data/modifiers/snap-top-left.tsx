import { Modifier } from "@dnd-kit/core";
import { getEventCoordinates } from "@dnd-kit/utilities";

export const snapTopLeftToCursor: Modifier = ({
    activatorEvent,
    draggingNodeRect,
    transform,
}) => {
    if (draggingNodeRect && activatorEvent) {
        const activatorCoordinates = getEventCoordinates(activatorEvent);

        if (!activatorCoordinates) {
            return transform;
        }

        const offsetX = activatorCoordinates.x - draggingNodeRect.left + 4;
        const offsetY = activatorCoordinates.y - draggingNodeRect.top + 4;

        return {
            ...transform,
            x: transform.x + offsetX,
            y: transform.y + offsetY,
        };
    }

    return transform;
};