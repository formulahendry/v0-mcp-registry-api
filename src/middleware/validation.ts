import Joi from "joi"
import type { Request, Response, NextFunction } from "express"

const serverDetailSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid("active", "deprecated").default("active"),
  repository: Joi.object({
    url: Joi.string().uri().required(),
    source: Joi.string().required(),
    id: Joi.string().required(),
    subfolder: Joi.string().optional(),
  }).optional(),
  version_detail: Joi.object({
    version: Joi.string().required(),
    release_date: Joi.string().isoDate().required(),
    is_latest: Joi.boolean().required(),
  }).required(),
  packages: Joi.array()
    .items(
      Joi.object({
        registry_type: Joi.string().optional(),
        registry_base_url: Joi.string().uri().optional(),
        identifier: Joi.string().optional(),
        version: Joi.string().optional(),
        file_sha256: Joi.string().optional(),
        runtime_hint: Joi.string().optional(),
        runtime_arguments: Joi.array().optional(),
        package_arguments: Joi.array().optional(),
        environment_variables: Joi.array().optional(),
      }),
    )
    .optional(),
  remotes: Joi.array()
    .items(
      Joi.object({
        transport_type: Joi.string().valid("streamable", "sse").required(),
        url: Joi.string().uri().required(),
        headers: Joi.array().optional(),
      }),
    )
    .optional(),
  _meta: Joi.object().optional(),
})

const queryParamsSchema = Joi.object({
  cursor: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).default(30),
  version: Joi.string().optional(),
})

export const validateServerDetail = (req: Request, res: Response, next: NextFunction) => {
  const { error } = serverDetailSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

export const validateQueryParams = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = queryParamsSchema.validate(req.query)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  req.query = value
  next()
}
