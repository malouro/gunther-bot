import { writeFileSync } from 'node:fs'
import path from 'node:path'
import * as prettier from 'prettier'

import { camelCase, flow, upperFirst } from 'lodash'

import CropJson from '@/data/json/Crops.json'
import ObjectJson from '@/data/json/Objects.json'
import { SDVCrop } from '@/data/types'
import { autoGenWarning } from '.'

export default async function (): Promise<void> {
	let indexContent = autoGenWarning + '\n\n'

	for (const key of Object.keys(CropJson)) {
		// console.info('Generating crop data for #', key)
		const {
			HarvestItemId: objectId,
			Seasons: seasons,
			HarvestMinStack: harvestMin,
			HarvestMaxStack: harvestMax,
			IsRaised: trellisCrop,
			IsPaddyCrop: paddyCrop,
			RegrowDays: regrowDays,
		} = CropJson[key]
		const { Price: price, Name: name } = ObjectJson[objectId]

		console.info('Generating crop data for ', name)

		const cropData: SDVCrop = {
			name,
			id: Number(objectId),
			seasons,
			harvestMin,
			harvestMax,
			trellisCrop,
			paddyCrop,
			regrow: regrowDays !== -1,
			regrowDays: regrowDays === -1 ? 0 : regrowDays,
			sellPrice: price,
		}

		const codeSafeName = flow(camelCase, upperFirst)(name.replace(/\s+/g, ''))
		const fileContent = `${autoGenWarning}

import { SDVCrop } from '@/data/types'
export default ${JSON.stringify(cropData, null, '\t')} as SDVCrop
`
		writeFileSync(
			path.resolve(__dirname, `../../crops/${codeSafeName}.ts`),
			await prettier.format(fileContent, {
				semi: false,
				parser: 'typescript',
				useTabs: true,
				singleQuote: true,
			})
		)

		indexContent += `import ${codeSafeName} from './${codeSafeName}'
export { ${codeSafeName} }
`
	}

	writeFileSync(path.resolve(__dirname, '../../crops/index.ts'), indexContent)
}
