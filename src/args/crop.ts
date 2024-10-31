import { SDVCropName, SDVCropList } from '@/data/types'
import { capitalize } from '@/utils'
import { Args } from '@sapphire/framework'
import { isNullishOrEmpty } from '@sapphire/utilities'

export const CropArgument = Args.make<SDVCropName>(
	(parameter: string, { argument }) => {
		const formattedCropName: SDVCropName = parameter
			.split(/\s+/)
			.map(w => capitalize(w))
			.join('') as unknown as SDVCropName

		console.info(formattedCropName)

		if (
			!isNullishOrEmpty(parameter) &&
			SDVCropList.includes(formattedCropName)
		) {
			return Args.ok(formattedCropName)
		}

		return Args.error({
			argument,
			parameter,
			identifier: 'SDV_Crop',
			message: 'Provided argument was not a valid crop name.',
		})
	}
)
