import { writeFileSync } from 'node:fs'
import path from 'node:path'
import * as prettier from 'prettier'
import { camelCase, flow, upperFirst } from 'lodash'
import { autoGenWarning } from '.'
import CropJson from '@/data/json/Crops.json'
import ObjectJson from '@/data/json/Objects.json'
import { SDVCrop } from '@/data/types'
import sharp from 'sharp'

const IMAGE_BASE_URL =
	'https://raw.githubusercontent.com/malouro/gunther-bot/refs/heads/main/src/data/img/crops'

export default async function (): Promise<void> {
	let indexContent = autoGenWarning + '\n\n'

	for (const key of Object.keys(CropJson)) {
		const {
			HarvestItemId: objectId,
			Seasons: seasons,
			HarvestMinStack: harvestMin,
			HarvestMaxStack: harvestMax,
			IsRaised: trellisCrop,
			IsPaddyCrop: paddyCrop,
			RegrowDays: regrowDays,
			DaysInPhase: daysInPhase,
		} = CropJson[key]
		const {
			Price: price,
			Name: name,
			Texture: tileSheet,
			SpriteIndex: spriteIndex,
		} = ObjectJson[objectId]
		const growth = (daysInPhase as number[]).reduce((acc, cur) => acc + cur, 0)

		console.info('Generating crop data for ', name)

		const id = Number(objectId)

		// shorts
		let imagePath =
			'https://stardewvalleywiki.com/mediawiki/images/0/04/Springobjects789.png'

		const rawItemImageFile = path.resolve(
			tileSheet === null
				? 'unpacked_data/Content (unpacked)/Maps/springobjects.png'
				: `unpacked_data/Content (unpacked)/${tileSheet.replaceAll(
						'\\',
						'/'
				  )}.png`
		)

		try {
			const img = sharp(rawItemImageFile)
			const { width } = await img.metadata()
			const spritePerRow = width / 16
			const imageIndex = Number.isNaN(id) ? spriteIndex : id

			img.extract({
				left: (imageIndex % spritePerRow) * 16,
				top: Math.floor(imageIndex / spritePerRow) * 16,
				width: 16,
				height: 16,
			})

			await img.toFile(`src/data/img/crops/${name}.png`)

			imagePath = encodeURI(`${IMAGE_BASE_URL}/${name}.png`)
		} catch (error) {
			console.error(`Error generating image for ${name}:`, error)
		}

		const cropData: SDVCrop = {
			name,
			id,
			image: imagePath,
			seasons,
			harvestMin,
			harvestMax,
			trellisCrop,
			paddyCrop,
			growth,
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
			path.resolve(__dirname, `../crops/${codeSafeName}.ts`),
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

	writeFileSync(path.resolve(__dirname, '../crops/index.ts'), indexContent)
}
