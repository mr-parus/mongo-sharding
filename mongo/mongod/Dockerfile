FROM mongo:latest

COPY --chown=mongodb:mongodb entry.sh /usr/local/bin/
COPY --chown=mongodb:mongodb init.sh /usr/local/bin/

RUN chmod u+x /usr/local/bin/init.sh /usr/local/bin/entry.sh

ENTRYPOINT ["entry.sh"]

CMD mongod -f /etc/mongod.conf
