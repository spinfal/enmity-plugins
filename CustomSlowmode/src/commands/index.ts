import { addSlowmodeValue } from "./add";
import { listSlowmodeValues } from "./list";
import { removeSlowmodeValue } from "./remove";
import { resetSlowmodeValues } from "./reset";

const commands = [addSlowmodeValue, removeSlowmodeValue, listSlowmodeValues, resetSlowmodeValues];

export { commands };