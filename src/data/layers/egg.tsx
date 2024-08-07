/**
 * @module
 * @hidden
 */
import { main } from "data/projEntry";
import { createCumulativeConversion, createPolynomialScaling } from "features/conversion";
import { jsx } from "features/feature";
import { createHotkey } from "features/hotkey";
import { createReset } from "features/reset";
import MainDisplay from "features/resources/MainDisplay.vue";
import { createResource } from "features/resources/resource";
import { addTooltip } from "features/tooltips/tooltip";
import { createResourceTooltip } from "features/trees/tree";
import { createUpgrade } from "features/upgrades/upgrade";
import { BaseLayer, createLayer } from "game/layers";
import type { DecimalSource } from "util/bignum";
import { render } from "util/vue";
import { createLayerTreeNode, createResetButton } from "../common";

const id = "e";
const layer = createLayer(id, function (this: BaseLayer) {
    const name = "Egg";
    const color = "#FFC90E";
    const points = createResource<DecimalSource>(0, "egg points");

    const conversion = createCumulativeConversion(() => ({
        scaling: createPolynomialScaling(10, 0.5),
        baseResource: main.points,
        gainResource: points,
        roundUpCost: true
    }));

    const reset = createReset(() => ({
        thingsToReset: (): Record<string, unknown>[] => [layer]
    }));

    const treeNode = createLayerTreeNode(() => ({
        layerID: id,
        color,
        reset
    }));
    addTooltip(treeNode, {
        display: createResourceTooltip(points),
        pinnable: true
    });

    const resetButton = createResetButton(() => ({
        conversion,
        tree: main.tree,
        treeNode
    }));

    const hotkey = createHotkey(() => ({
        description: "Reset for Egg Points",
        key: "e",
        onPress: resetButton.onClick
    }));

	const addGainUpgrade = createUpgrade(() => ({
		display: {
			title: "Generator of Genericness",
			description: "Gain 1 point every second"
		},
		cost: 1,
		resource: points
	}));

    return {
        name,
        color,
        points,
        display: jsx(() => (
            <>
                <MainDisplay resource={points} color={color} />
                {render(resetButton)}
            </>
        )),
        treeNode,
        hotkey
    };
});

export default layer;
