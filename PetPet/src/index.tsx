import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { petpetCommands } from './commands';
import { React } from "enmity/metro/common";
import { ScrollView } from "enmity/components";
import UpdateButton from "../../common/components/updateButton";

const PetPet: Plugin = {
    ...manifest,
    onStart() {
        this.commands = petpetCommands
    },
    onStop() {
        this.commands = []
    },
    patches: [],
    getSettingsPanel({ settings }) {
        return (
            <ScrollView settings={settings}>
                <UpdateButton pluginUrl={manifest.sourceUrl} />
            </ScrollView>
        );
    },
};

registerPlugin(PetPet);
