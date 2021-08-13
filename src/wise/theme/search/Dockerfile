FROM node:14-buster-slim

RUN runDeps="openssl ca-certificates patch" \
 && apt-get update \
 && apt-get install -y --no-install-recommends $runDeps \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN curl -f https://get.pnpm.io/v6.7.js | node - add --global pnpm

RUN mkdir -p /opt/searchproxy \
 && chown -R node /opt/searchproxy

COPY . /opt/searchproxy

RUN git clone https://github.com/eea/searchlib.git \
	&& cd searchlib \
  && pnpm i

RUN cd /opt/searchproxy/searchlib/packages/searchlib \
  && pnpm build

RUN cd /opt/searchproxy/searchlib/packages/searchlib-less \
  && pnpm build

RUN cd /opt/searchproxy/searchlib/packages/searchlib-middleware \
  && pnpm build

RUN cd /opt/searchproxy \
	&& pnpm link searchlib/packages/searchlib \
  && pnpm link searchlib/packages/searchlib-less \
  && pnpm link searchlib/packages/searchlib-middleware

RUN cd /opt/searchproxy \
  && pnpm build:server

WORKDIR /opt/searchproxy/
CMD pnpm server

EXPOSE 7000

# RUN npm install -g yo @plone/generator-volto wait-on
#
# USER node
# RUN yo --no-insight @plone/volto --no-interactive
#
# RUN RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn \
#  && RAZZLE_API_PATH=VOLTO_API_PATH RAZZLE_INTERNAL_API_PATH=VOLTO_INTERNAL_API_PATH yarn build
# COPY entrypoint.sh /
# ENTRYPOINT ["/entrypoint.sh"]
# CMD ["yarn", "start:prod"]
